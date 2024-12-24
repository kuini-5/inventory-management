import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const inventories = await prisma.product.findMany({
        include: {
          category: true,
          supplier: true,
        },
      });
      res.status(200).json(inventories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory. ' + error });
    }
  } else if (req.method === 'POST') {
    const { name, sku, price, categoryId, supplierId, description } = req.body;
    try {
      const inventory = await prisma.product.create({
        data: {
          name,
          sku,
          price,
          categoryId,
          supplierId,
          description,
        },
      });
      res.status(201).json(inventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create inventory. ' + error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}