import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.delete('token');
  response.cookies.delete('user');
  return response;
}