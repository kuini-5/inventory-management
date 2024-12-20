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
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ message: 'Invalid or expired token', error: error.message }, { status: 403 });
    }
  }
}

export const config = {
  matcher: '/api/:path*',
};