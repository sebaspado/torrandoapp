import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        include: {
          assignee: {
            select: {
              name: true,
            },
          },
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  } else if (req.method === 'POST') {
    try {
      const task = await prisma.task.create({
        data: req.body,
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 