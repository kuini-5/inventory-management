import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const inventory = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          category: true,
          supplier: true,
        },
      });
      if (inventory) {
        res.status(200).json(inventory);
      } else {
        res.status(404).json({ error: 'Inventory not found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory. ' + error });
    }
  } else if (req.method === 'PUT') {
    const { name, sku, price, categoryId, supplierId, description } = req.body;
    try {
      const updatedInventory = await prisma.product.update({
        where: { id: Number(id) },
        data: { name, sku, price, categoryId, supplierId, description },
      });
      res.status(200).json(updatedInventory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update inventory. ' + error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete inventory. ' + error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}