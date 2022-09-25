import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { TbPlus } from 'react-icons/tb';
import { FaSpinner } from 'react-icons/fa';
import cn from 'classnames';

import Layout from '@/layouts/default/Layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import SearchGlobal from '@/components/SearchGlobal';

const Dictionary: NextPage = () => {
  const router = useRouter();
  let { language } = router.query;
  language = language as string;

  const { isLoading, error, data } = useQuery(['language', language], () =>
    fetch(`/api/language/${language}`)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  const {
    isLoading: isLoadingVoc,
    error: errorVoc,
    data: dataVoc,
  } = useQuery(['vocabulary'], () =>
    fetch(`/api/vocabulary?perPage=10`)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  return (
    <Layout>
      <>
        <SearchGlobal language={language} />
        <div className="mx-auto max-w-7xl px-4 mt-12 mb-24">
          <div className="flex flex-col gap-6">
            {error && <div>Failed to load</div>}
            {isLoading && (
              <div className="flex">
                <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                Loading...
              </div>
            )}

            {data && (
              <>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4">
                  <div>
                    <h1 className="text-5xl mb-4">{data.name} Dictionary</h1>
                    <p>
                      Get clear definitions and audio pronunciations of words,
                      phrases, and idioms.
                    </p>
                  </div>
                  <Link href={`/dictionary/${language}/create`}>
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
                <div>
                  <h3 className="text-3xl mb-4">New</h3>

                  {errorVoc && <div>Failed to load</div>}
                  {isLoadingVoc && (
                    <div className="flex">
                      <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                      Loading...
                    </div>
                  )}

                  {dataVoc && (
                    <ul className="list-inside list-disc">
                      {dataVoc.map((voc: any) => (
                        <li key={voc.id} className="pb-2">
                          <Link href={`/dictionary/${language}/${voc.slug}`}>
                            <a className="underline hover:text-blue-700">
                              {voc.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </>
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
