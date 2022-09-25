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
  const { sort, perPage } = req.query;

  const options = {
    where: {
      userId: payload.id,
    },
  };

  // Sort
  let pSort;
  if (sort) {
    pSort = (sort as string).split(':');
  } else {
    pSort = ['mat', 'desc'];
  }

  Object.assign(options, {
    orderBy: {
      [pSort[0]]: pSort[1],
    },
  });

  // Take
  if (perPage) {
    Object.assign(options, { take: Number(perPage) });
  }

  const result = await prisma.vocabulary.findMany(options);

  res.status(200).json({ code: 200, data: result });
};

const createItem = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const { slug } = req.query;
  const payload = verify(token);

  const body = JSON.parse(req.body);

  const language = await prisma.language.findFirst({
    where: { slug: slug?.toString(), userId: payload.id },
  });
  const languageId = language?.id as string;

  const result = await prisma.vocabulary.create({
    data: {
      userId: payload.id,
      languageId: languageId,
      slug: slugify(body.name, {
        replacement: '-',
        lower: true,
      }),
      alphabet: body.alphabet,
      name: body.name,
      translate: body.translate,
      link: body.link,
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
