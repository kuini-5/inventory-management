import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

interface UserPayload {
  id: number;
  username: string;
}

export async function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname;

  if (urlPath.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const user = payload as unknown as UserPayload;

    console.log('User:', user);

    const userHeaders = new Headers(req.headers);
    userHeaders.set('x-user-id', user.id.toString());
    userHeaders.set('x-user-username', user.username);

    return NextResponse.next({
      request: {
        headers: userHeaders,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Token verification error:', error.message);
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
}

export const config = {
  matcher: '/api/:path*',
};