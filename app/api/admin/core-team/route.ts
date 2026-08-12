import { NextResponse } from 'next/server';
import { CoreTeamMember } from '@/models/CoreTeamMember';
import connectDB from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { ActivityLog } from '@/models/ActivityLog';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const JWT_SECRET = process.env.JWT_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all core team members
export async function GET() {
  try {
    await connectDB();
    const members = await CoreTeamMember.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch core team members' }, { status: 500 });
  }
}

// POST new member
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    // Get admin username from JWT
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    let adminUsername = 'Unknown';
    if (token && JWT_SECRET) {
      try {
        const decoded: any = verify(token, JWT_SECRET as string);
        adminUsername = decoded.username || 'Unknown';
      } catch {}
    }
    let imageUrl = data.image;
    if (data.image.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(data.image, { folder: 'core-team' });
      imageUrl = result.secure_url;
    }
    const member = new CoreTeamMember({ ...data, image: imageUrl, lastModifiedBy: adminUsername });
    await member.save();
    await ActivityLog.create({
      entityType: 'CoreTeam',
      entityId: member._id.toString(),
      action: 'add',
      adminUsername,
      details: { name: member.name, role: member.role },
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create core team member' }, { status: 500 });
  }
}

// PUT update member
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const data = await request.json();
    // Get admin username from JWT
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    let adminUsername = 'Unknown';
    if (token && JWT_SECRET) {
      try {
        const decoded: any = verify(token, JWT_SECRET as string);
        adminUsername = decoded.username || 'Unknown';
      } catch {}
    }
    const member = await CoreTeamMember.findByIdAndUpdate(id, { ...data, lastModifiedBy: adminUsername }, { new: true });
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await ActivityLog.create({
      entityType: 'CoreTeam',
      entityId: member._id.toString(),
      action: 'edit',
      adminUsername,
      details: { name: member.name, role: member.role },
    });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update core team member' }, { status: 500 });
  }
}

// DELETE member
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const cookieStore: ReadonlyRequestCookies = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    let adminUsername = 'Unknown';
    if (token && JWT_SECRET) {
      try {
        const decoded: any = verify(token, JWT_SECRET as string);
        adminUsername = decoded.username || 'Unknown';
      } catch {}
    }
    const member = await CoreTeamMember.findByIdAndDelete(id);
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await ActivityLog.create({
      entityType: 'CoreTeam',
      entityId: member._id.toString(),
      action: 'delete',
      adminUsername,
      details: { name: member.name, role: member.role },
    });
    // Optionally delete image from Cloudinary
    if (member.image.includes('cloudinary')) {
      const publicId = member.image.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete core team member' }, { status: 500 });
  }
} 