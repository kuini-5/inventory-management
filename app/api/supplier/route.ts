import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const suppliers = await prisma.supplier.findMany();
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suppliers. ' + error });
    }
  } else if (req.method === 'POST') {
    const { name, contact, email, phone } = req.body;
    try {
      const supplier = await prisma.supplier.create({
        data: { name, contact, email, phone },
      });
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create supplier. ' + error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}