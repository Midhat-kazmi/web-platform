import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Testimonial } from '@/models/Testimonial';

// GET: Fetch approved testimonials for public display
export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST: Submit a new testimonial (public)
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.role || !data.email || !data.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.create({
      ...data,
      imageUrl: data.imageUrl || '/avatar.svg',
      isApproved: false, // Explicitly false for public submissions
      type: data.videoUrl ? 'video' : 'text'
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
