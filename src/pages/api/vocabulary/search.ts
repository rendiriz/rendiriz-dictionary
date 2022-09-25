import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { verify } from '@/lib/jwt';
import { meili } from '@/lib/meili';

const secret = process.env.NEXTAUTH_SECRET;

const getList = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const payload = verify(token);
  const { q, language } = req.query;

  const result = await meili.index('vocabulary').search(q, {
    sort: ['name:asc'],
    filter: [
      `userId = "${payload.id}"`,
      `languageSlug = "${language}"`,
      'isActive = true',
      'isDelete = false',
    ],
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
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
