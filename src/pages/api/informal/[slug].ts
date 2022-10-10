import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { verify } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

const getSingle = async (
  req: NextApiRequest,
  res: NextApiResponse,
  token: string,
) => {
  const { slug } = req.query;
  const payload = verify(token);

  const result = await prisma.informal.findFirst({
    where: { slug: slug?.toString(), userId: payload.id },
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
        return getSingle(req, res, token);
      } catch (err: any) {
        return res.status(500).end(err.message);
      }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
