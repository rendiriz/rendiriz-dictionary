import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames';

import Layout from '@/layouts/default/Layout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const SlangCreate: NextPage = () => {
  const router = useRouter();
  const { language } = router.query;

  const mutation = useMutation(
    (payload: any) =>
      fetch(`/api/slang`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((res) => res.data),
    {
      onSuccess: async () => {
        router.push(`/dictionary/${language}`);
      },
    },
  );

  const handleCreate = async (formValues: any) => {
    mutation.mutate(formValues);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 mt-12 mb-24">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl mb-4">Create Slang</h1>

          <Formik
            initialValues={{
              language: language,
              alphabet: '',
              name: '',
              translate: '',
              link: '',
            }}
            validationSchema={Yup.object({
              alphabet: Yup.string().nullable(),
              name: Yup.string().required('Required'),
              translate: Yup.string().required('Required'),
              link: Yup.string().nullable(),
            })}
            onSubmit={(values) => {
              handleCreate(values);
            }}
          >
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="alphabet"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Alphabet
                </label>
                <Field name="alphabet">
                  {({ field, meta }: any) => (
                    <>
                      <input
                        type="text"
                        id="alphabet"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Alphabet"
                        {...field}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-red-500 text-sm mt-1">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Slang
                </label>
                <Field name="name">
                  {({ field, meta }: any) => (
                    <>
                      <input
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Slang"
                        {...field}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-red-500 text-sm mt-1">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="translate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Translate
                </label>
                <Field name="translate">
                  {({ field, meta }: any) => (
                    <>
                      <textarea
                        id="translate"
                        rows={4}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Translate"
                        {...field}
                      ></textarea>
                      {meta.touched && meta.error && (
                        <div className="text-red-500 text-sm mt-1">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="link"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Link
                </label>
                <Field name="link">
                  {({ field, meta }: any) => (
                    <>
                      <input
                        type="text"
                        id="link"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Link"
                        {...field}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-red-500 text-sm mt-1">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>
              <div>
                <button
                  type="submit"
                  className={cn(
                    'px-5 py-2.5',
                    'text-white bg-blue-700 dark:bg-blue-600',
                    'enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-700',
                    'flex items-center justify-center rounded-lg transition-all',
                    'font-medium text-sm',
                    'flex-shrink-0',
                  )}
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'Loading...' : 'Save'}
                </button>
              </div>
            </Form>
          </Formik>
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

export default SlangCreate;
