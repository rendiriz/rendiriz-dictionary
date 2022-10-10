import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';

import Layout from '@/layouts/default/Layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import SearchGlobal from '@/components/SearchGlobal';

const VocabularyDetail: NextPage = () => {
  const router = useRouter();
  let { language, slug } = router.query;
  language = language as string;

  const { isLoading, error, data } = useQuery(['vocabulary', slug], () =>
    fetch(`/api/vocabulary/${slug}`)
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
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-5xl mb-4">Vocabulary: {data.name}</h1>
                </div>

                <div>
                  {data.alphabet && (
                    <div className="mb-4">
                      <label className="block mb-1">Alphabet</label>
                      <div className="font-bold">{data.alphabet}</div>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block mb-1">Translate</label>
                    <div className="font-bold">{data.translate}</div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Link</label>
                    <div className="font-bold">
                      <a
                        className="underline break-words hover:text-blue-700"
                        href={data.link}
                        target="blank"
                      >
                        {data.link}
                      </a>
                    </div>
                  </div>
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

export default VocabularyDetail;
