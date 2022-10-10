import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import slugify from 'slugify';
import { verify } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { meili } from '@/lib/meili';

const secret = process.env.NEXTAUTH_SECRET;

const getList = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const payload = verify(token);
  const { q: search, language, sort, perPage } = req.query;

  const options = {
    where: {
      userId: payload.id,
    },
  };

  // Language
  if (language) {
    const findLanguage = await prisma.language.findFirst({
      where: { slug: language as string, userId: payload.id },
    });
    const languageId = findLanguage?.id as string;

    Object.assign(options.where, { languageId: languageId });
  }

  // Search
  if (search) {
    Object.assign(options.where, { name: { contains: search } });
  }

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

  const result = await prisma.word.findMany(options);

  res.status(200).json({ code: 200, data: result });
};

const createItem = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const payload = verify(token);

  const body = JSON.parse(req.body);

  const language = await prisma.language.findFirst({
    where: { slug: body.language, userId: payload.id },
  });
  const languageId = language?.id as string;
  // const languageSlug = language?.slug;
  // const languageName = language?.name;

  const result = await prisma.word.create({
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

  // await meili.index('word').addDocuments([
  //   {
  //     id: result.id,
  //     userId: payload.id,
  //     userName: payload.name,
  //     languageId: languageId,
  //     languageSlug: languageSlug,
  //     languageName: languageName,
  //     slug: result.slug,
  //     alphabet: result.alphabet,
  //     name: result.name,
  //     translate: result.translate,
  //     link: result.link,
  //     isActive: result.isActive,
  //     isDelete: result.isDelete,
  //     cat: result.cat,
  //     mat: result.mat,
  //   },
  // ]);

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
