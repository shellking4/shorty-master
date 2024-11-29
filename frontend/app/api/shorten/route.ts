import { NextResponse } from 'next/server';
import { shortenUrl, urlSchema } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = urlSchema.parse(body);
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await shortenUrl(validatedData.url, token);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 400 }
    );
  }
}