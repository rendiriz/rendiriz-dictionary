import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import slugify from 'slugify';
import { verify } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

const getList = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const payload = verify(token);
  const { sort } = req.query;

  let pSort;
  if (sort) {
    pSort = (sort as string).split(':');
  } else {
    pSort = ['mat', 'desc'];
  }

  const result = await prisma.language.findMany({
    where: {
      userId: payload.id,
    },
    orderBy: {
      [pSort[0]]: pSort[1],
    },
  });

  res.status(200).json({ code: 200, data: result });
};

const createItem = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const payload = verify(token);

  const body = JSON.parse(req.body);

  const result = await prisma.language.create({
    data: {
      userId: payload.id,
      slug: slugify(body.name, {
        replacement: '-',
        lower: true,
      }),
      name: body.name,
      description: body.description,
      cuid: payload.id,
    },
  });

  res.status(200).json({ code: 200, data: result });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  const token = await getToken({ req, secret, raw: true });
  if (!token) {
    return res.status(401).end(`Unauthorized`);
  }

  switch (method) {
    case 'GET':
      try {
        return getList(req, res, token);
      } catch (err: any) {
        return res.status(500).end(err.message);
      }
    case 'POST':
      try {
        return createItem(req, res, token);
      } catch (err: any) {
        return res.status(500).end(err.message);
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
