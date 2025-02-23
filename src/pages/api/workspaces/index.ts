import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const workspaces = await prisma.workspace.findMany({
        where: {
          users: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      res.status(200).json(workspaces);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching workspaces' });
    }
  } else if (req.method === 'POST') {
    try {
      const workspace = await prisma.workspace.create({
        data: {
          name: req.body.name,
          users: {
            create: {
              userId: session.user.id,
              role: 'OWNER',
            },
          },
        },
      });
      res.status(201).json(workspace);
    } catch (error) {
      res.status(500).json({ error: 'Error creating workspace' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 