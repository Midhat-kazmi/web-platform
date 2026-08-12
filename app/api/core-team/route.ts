import { NextResponse } from 'next/server';
import { CoreTeamMember } from '@/models/CoreTeamMember';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const members = await CoreTeamMember.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch core team members' }, { status: 500 });
  }
} 