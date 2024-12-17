import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_, { params }) {
  const { id } = params;
  // Get a single <%= resource %>
  const data = await prisma.<%= resource %>.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(data);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  // Update a <%= resource %>
  const updatedData = await prisma.<%= resource %>.update({
    where: { id: Number(id) },
    data: body,
  });
  return NextResponse.json(updatedData);
}

export async function DELETE(_, { params }) {
  const { id } = params;
  // Delete a <%= resource %>
  await prisma.<%= resource %>.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ message: 'Deleted successfully' }, { status: 204 });
}