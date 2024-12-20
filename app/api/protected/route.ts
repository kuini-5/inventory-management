import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const username = req.headers.get('x-user-username');

  if (!userId || !username) {
    return NextResponse.json({ message: 'Unauthorized - User not found' }, { status: 401 });
  }

  return NextResponse.json({
    message: `Welcome, ${username}!`,
    user: {
      id: userId,
      username: username,
    },
  });
}