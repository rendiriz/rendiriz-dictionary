import { Fragment } from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { TbChevronDown } from 'react-icons/tb';
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

  const {
    isLoading: isLoadingWor,
    error: errorWor,
    data: dataWor,
  } = useQuery(['word'], () =>
    fetch(`/api/word?perPage=10`)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  const {
    isLoading: isLoadingInf,
    error: errorInf,
    data: dataInf,
  } = useQuery(['informal'], () =>
    fetch(`/api/informal?perPage=10`)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  const {
    isLoading: isLoadingSla,
    error: errorSla,
    data: dataSla,
  } = useQuery(['slang'], () =>
    fetch(`/api/slang?perPage=10`)
      .then((res) => res.json())
      .then((res) => res.data),
  );

  const {
    isLoading: isLoadingSen,
    error: errorSen,
    data: dataSen,
  } = useQuery(['sentence'], () =>
    fetch(`/api/sentence?perPage=10`)
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

                  <Menu
                    as="div"
                    className="relative inline-block text-left w-full md:w-auto"
                  >
                    <div className="block w-full">
                      <Menu.Button
                        className={cn(
                          'px-5 py-2.5',
                          'text-white bg-blue-700 dark:bg-blue-600',
                          'hover:bg-blue-800 dark:hover:bg-blue-700',
                          'flex w-full md:w-auto items-center justify-center rounded-lg transition-all',
                          'font-medium text-sm',
                          'flex-shrink-0',
                        )}
                      >
                        <span>Create</span>
                        <TbChevronDown className="w-5 h-5 ml-2" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-full md:w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-900 dark:border dark:border-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <ul className="px-2 py-2.5">
                          <Menu.Item as="li">
                            {({ active }) => (
                              <Link
                                href={`/dictionary/${language}/vocabulary/create`}
                              >
                                <a
                                  className={cn(
                                    active && 'bg-blue-50 dark:bg-gray-800',
                                    'block px-2.5 py-2 rounded-md',
                                  )}
                                >
                                  Vocabulary
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li">
                            {({ active }) => (
                              <Link
                                href={`/dictionary/${language}/word/create`}
                              >
                                <a
                                  className={cn(
                                    active && 'bg-blue-50 dark:bg-gray-800',
                                    'block px-2.5 py-2 rounded-md',
                                  )}
                                >
                                  Word
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li">
                            {({ active }) => (
                              <Link
                                href={`/dictionary/${language}/informal/create`}
                              >
                                <a
                                  className={cn(
                                    active && 'bg-blue-50 dark:bg-gray-800',
                                    'block px-2.5 py-2 rounded-md',
                                  )}
                                >
                                  Informal
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li">
                            {({ active }) => (
                              <Link
                                href={`/dictionary/${language}/slang/create`}
                              >
                                <a
                                  className={cn(
                                    active && 'bg-blue-50 dark:bg-gray-800',
                                    'block px-2.5 py-2 rounded-md',
                                  )}
                                >
                                  Slang
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item as="li">
                            {({ active }) => (
                              <Link
                                href={`/dictionary/${language}/sentence/create`}
                              >
                                <a
                                  className={cn(
                                    active && 'bg-blue-50 dark:bg-gray-800',
                                    'block px-2.5 py-2 rounded-md',
                                  )}
                                >
                                  Sentence
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                        </ul>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div>
                  <h3 className="text-3xl mb-4">New Vocabularies</h3>

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
                          <Link
                            href={`/dictionary/${language}/vocabulary/${voc.slug}`}
                          >
                            <a className="underline hover:text-blue-700">
                              {voc.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl mb-4">New Words</h3>

                  {errorWor && <div>Failed to load</div>}
                  {isLoadingWor && (
                    <div className="flex">
                      <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                      Loading...
                    </div>
                  )}

                  {dataWor && (
                    <ul className="list-inside list-disc">
                      {dataWor.map((wor: any) => (
                        <li key={wor.id} className="pb-2">
                          <Link
                            href={`/dictionary/${language}/word/${wor.slug}`}
                          >
                            <a className="underline hover:text-blue-700">
                              {wor.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl mb-4">New Informals</h3>

                  {errorInf && <div>Failed to load</div>}
                  {isLoadingInf && (
                    <div className="flex">
                      <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                      Loading...
                    </div>
                  )}

                  {dataInf && (
                    <ul className="list-inside list-disc">
                      {dataInf.map((inf: any) => (
                        <li key={inf.id} className="pb-2">
                          <Link
                            href={`/dictionary/${language}/informal/${inf.slug}`}
                          >
                            <a className="underline hover:text-blue-700">
                              {inf.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl mb-4">New Slangs</h3>

                  {errorSla && <div>Failed to load</div>}
                  {isLoadingSla && (
                    <div className="flex">
                      <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                      Loading...
                    </div>
                  )}

                  {dataSla && (
                    <ul className="list-inside list-disc">
                      {dataSla.map((sla: any) => (
                        <li key={sla.id} className="pb-2">
                          <Link
                            href={`/dictionary/${language}/slang/${sla.slug}`}
                          >
                            <a className="underline hover:text-blue-700">
                              {sla.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl mb-4">New Sentences</h3>

                  {errorSen && <div>Failed to load</div>}
                  {isLoadingSen && (
                    <div className="flex">
                      <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                      Loading...
                    </div>
                  )}

                  {dataSen && (
                    <ul className="list-inside list-disc">
                      {dataSen.map((sen: any) => (
                        <li key={sen.id} className="pb-2">
                          <Link
                            href={`/dictionary/${language}/sentence/${sen.slug}`}
                          >
                            <a className="underline hover:text-blue-700">
                              {sen.name}
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
