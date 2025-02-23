import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const task = await prisma.task.update({
        where: { id: String(id) },
        data: req.body,
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error updating task' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id: String(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 