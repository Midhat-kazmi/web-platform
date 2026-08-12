import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DSOCApplication } from '@/models/DSOCApplication';
import { DSOCProject } from '@/models/DSOCProject';
import jwt from 'jsonwebtoken';

// Helper to get mentee from token
async function getMenteeFromToken(request: NextRequest) {
  const token = request.cookies.get('dsoc-mentee-token')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    if (decoded.role !== 'dsoc-mentee') return null;
    return decoded.id;
  } catch {
    return null;
  }
}

function getDeadlineEnd(dateValue: string | Date) {
  if (dateValue instanceof Date) {
    // Treat stored date-only values as UTC calendar dates so we don't cut off early in local time zones.
    return new Date(
      dateValue.getUTCFullYear(),
      dateValue.getUTCMonth(),
      dateValue.getUTCDate(),
      23,
      59,
      59,
      999
    );
  }

  if (typeof dateValue !== 'string') {
    return new Date(dateValue as unknown as string);
  }

  const [year, month, day] = dateValue.slice(0, 10).split('-').map(Number);

  if (!year || !month || !day) {
    return new Date(dateValue);
  }

  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

// Helper to get mentor from token
async function getMentorFromToken(request: NextRequest) {
  const token = request.cookies.get('dsoc-mentor-token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    if (decoded.role !== 'dsoc-mentor') return null;
    return decoded.id;
  } catch {
    return null;
  }
}

// GET all applications (with filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('project');
    const status = searchParams.get('status');
    const mentorOnly = searchParams.get('mentor') === 'true';
    const menteeOnly = searchParams.get('my') === 'true';
    const menteeId = menteeOnly ? await getMenteeFromToken(request) : null;

    if (menteeOnly && !menteeId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const query: any = {};

    if (mentorOnly) {
      const mentorId = await getMentorFromToken(request);
      if (!mentorId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const mentorProjects = await DSOCProject.find({ mentors: mentorId })
        .select('_id')
        .lean();

      const mentorProjectIds = mentorProjects.map((project) => String(project._id));

      if (projectId) {
        if (!mentorProjectIds.includes(projectId)) {
          return NextResponse.json({ success: true, data: [] });
        }
        query.project = projectId;
      } else {
        query.project = { $in: mentorProjectIds };
      }
    } else {
      if (projectId) query.project = projectId;
      if (menteeId) query.mentee = menteeId;
    }

    if (status) query.status = status;
    
    const applications = await DSOCApplication.find(query)
      .populate('project', 'title organization status')
      .populate('mentee', 'name email picture university')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST create new application
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const menteeId = await getMenteeFromToken(request);
    
    if (!menteeId) {
      return NextResponse.json(
        { success: false, error: 'Please login to apply' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { projectId, ...applicationData } = body;

    // Drop empty-string optional fields so mongoose doesn't try to cast them
    // (empty string into a Date field throws CastError).
    Object.keys(applicationData).forEach((key) => {
      if (applicationData[key] === '' || applicationData[key] === null) {
        delete applicationData[key];
      }
    });
    
    // Check if project exists and is open
    const project = await DSOCProject.findById(projectId);
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    if (project.status !== 'open') {
      return NextResponse.json(
        { success: false, error: 'This project is not accepting applications' },
        { status: 400 }
      );
    }
    
    if (new Date() > getDeadlineEnd(project.applicationDeadline)) {
      return NextResponse.json(
        { success: false, error: 'Application deadline has passed' },
        { status: 400 }
      );
    }
    
    // Check for existing application
    const existingApplication = await DSOCApplication.findOne({
      project: projectId,
      mentee: menteeId,
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this project' },
        { status: 400 }
      );
    }
    
    const application = new DSOCApplication({
      project: projectId,
      mentee: menteeId,
      ...applicationData,
    });
    
    await application.save();
    
    return NextResponse.json({
      success: true,
      data: application,
      message: 'Application submitted successfully!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
