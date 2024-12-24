import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories. ' + error });
    }
  } else if (req.method === 'POST') {
    const { name, description } = req.body;
    try {
      const category = await prisma.category.create({
        data: { name, description },
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category. ' + error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}