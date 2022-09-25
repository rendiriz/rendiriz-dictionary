import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import { TbPlus } from 'react-icons/tb';
import { FaSpinner } from 'react-icons/fa';
import cn from 'classnames';

import Layout from '@/layouts/default/Layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Dictionary: NextPage = () => {
  const { isLoading, error, data } = useQuery(['language'], () =>
    fetch(`/api/language?sort=name:asc`)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 mt-12 mb-24">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4">
            <h1 className="text-5xl">Language</h1>
            <Link href={'/language/create'}>
              <a
                className={cn(
                  'px-5 py-2.5',
                  'text-white bg-blue-700 dark:bg-blue-600',
                  'hover:bg-blue-800 dark:hover:bg-blue-700',
                  'flex w-full md:w-auto items-center justify-center rounded-lg transition-all',
                  'font-medium text-sm',
                  'flex-shrink-0',
                )}
              >
                <TbPlus className="w-5 h-5 mr-2" />
                <span>Create</span>
              </a>
            </Link>
          </div>

          {error && <div>Failed to load</div>}
          {isLoading && (
            <div className="flex">
              <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
              Loading...
            </div>
          )}

          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.map((row: any) => (
                <Link key={row.id} href={`/dictionary/${row.slug}`}>
                  <a>
                    <div className="rounded-md border hover:border-blue-500 hover:shadow-md p-5">
                      <h5 className="text-xl mb-4">{row.name}</h5>
                      <p>{row.description}</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (!session) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  };
};

export default Dictionary;
