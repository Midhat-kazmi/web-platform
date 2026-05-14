import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DSOCMentee } from '@/models/DSOCMentee';

// GET DSOC mentees. Admin screens need the full roster, while callers can opt
// into the active + verified subset with ?verifiedOnly=true.
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';

    const query = verifiedOnly
      ? { isActive: true, isVerified: true }
      : {};

    const mentees = await DSOCMentee.find(query)
      .populate('mentor', '_id name company jobTitle picture')
      .select('_id name email university degree picture skills mentor projects applications isActive isVerified createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: mentees,
    });
  } catch (error) {
    console.error('Error fetching DSOC mentees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mentees' },
      { status: 500 }
    );
  }
}