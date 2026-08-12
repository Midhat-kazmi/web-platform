import { NextResponse } from 'next/server';
import { CoreTeamMember } from '@/models/CoreTeamMember';
import connectDB from '@/lib/db';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { ActivityLog } from '@/models/ActivityLog';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const JWT_SECRET = process.env.JWT_SECRET;

// POST: persist a new ordering for the core team.
// Body: { ids: string[] } — the member IDs in their desired display order.
// Each member's `order` is set to its 1-based position in the array.
export async function POST(request: Request) {
  try {
    await connectDB();
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 });
    }

    const cookieStore: ReadonlyRequestCookies = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    let adminUsername = 'Unknown';
    if (token && JWT_SECRET) {
      try {
        const decoded: any = verify(token, JWT_SECRET as string);
        adminUsername = decoded.username || 'Unknown';
      } catch {}
    }

    await CoreTeamMember.bulkWrite(
      ids.map((id: string, index: number) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index + 1, lastModifiedBy: adminUsername } },
        },
      }))
    );

    await ActivityLog.create({
      entityType: 'CoreTeam',
      entityId: 'reorder',
      action: 'edit',
      adminUsername,
      details: { count: ids.length, change: 'reordered core team' },
    });

    const members = await CoreTeamMember.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder core team' }, { status: 500 });
  }
}
