import { NextResponse } from 'next/server';
import { login, loginSchema } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const response = await login(validatedData);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}