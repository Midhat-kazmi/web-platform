import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DSOCMentor } from '@/models/DSOCMentor';

// GET DSOC mentors. Admin screens need the full roster, while callers can opt
// into the assignment-safe subset with ?verifiedOnly=true.
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';

    const query = verifiedOnly
      ? { isActive: true, isVerified: true }
      : {};

    const mentors = await DSOCMentor.find(query)
      .select('_id name email company jobTitle picture expertise isActive isVerified createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    console.error('Error fetching DSOC mentors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
}