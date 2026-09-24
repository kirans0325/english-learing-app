import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db/users';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return NextResponse.json(
        { error: 'Name, email, and password must be valid strings.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim()) || email.length > 254) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: 'Password must be between 6 and 128 characters.' },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      password,
      role: 'user',
    });

    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
