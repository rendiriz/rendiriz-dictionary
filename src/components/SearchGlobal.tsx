import { useRef, useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { HiSearch } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';
import cn from 'classnames';

type TSearchGlobal = {
  language: string;
};

const SearchGlobal = ({ language }: TSearchGlobal) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>({
    voc: [],
    wor: [],
    inf: [],
    sla: [],
    sen: [],
  });
  let typingTimer: number;

  useEffect(() => {
    return () => {
      clearTimeout(typingTimer);
    };
  }, []);

  const handleSearch = () => {
    const value = inputRef.current?.value || '';
    clearTimeout(typingTimer);
    typingTimer = window.setTimeout(async () => {
      if (value) {
        setIsLoading(true);
        await getSearch(value);
      }
    }, 500);
  };

  const getSearch = async (value: string) => {
    const voc = await fetch(`/api/vocabulary?q=${value}&language=${language}`);
    const wor = await fetch(`/api/word?q=${value}&language=${language}`);
    const inf = await fetch(`/api/informal?q=${value}&language=${language}`);
    const sla = await fetch(`/api/slang?q=${value}&language=${language}`);
    const sen = await fetch(`/api/sentence?q=${value}&language=${language}`);

    const data = await Promise.all([voc, wor, inf, sla, sen])
      .then(async (res) => {
        return {
          voc: await res[0].json(),
          wor: await res[1].json(),
          inf: await res[2].json(),
          sla: await res[3].json(),
          sen: await res[4].json(),
        };
      })
      .then(async (res: any) => {
        setIsLoading(false);
        return {
          voc: res.voc.data,
          wor: res.wor.data,
          inf: res.inf.data,
          sla: res.sla.data,
          sen: res.sen.data,
        };
      });

    setData(data);
  };

  return (
    <div className="bg-blue-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <button
          type="button"
          className={cn(
            'flex items-center space-x-2 w-full',
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm px-2.5 py-2.5 hover:border-gray-300',
            'focus:outline-none focus:border-gray-300 rounded-lg',
          )}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <HiSearch className="w-5 h-5 flex-none text-gray-400" />
          <span className="text-sm text-gray-400 flex-1 text-left">
            Search...
          </span>
        </button>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black dark:bg-white bg-opacity-25 dark:bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        className="col-span-6 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search"
                        ref={inputRef}
                        onKeyUp={() => {
                          handleSearch();
                        }}
                      />

                      <div>
                        <h6 className="text-lg font-bold mb-3">Result:</h6>

                        {isLoading && (
                          <div className="flex">
                            <FaSpinner className="icon-spin w-6 h-6 mr-3 text-blue-500" />
                            Loading...
                          </div>
                        )}

                        {data.voc.length > 0 && (
                          <>
                            <hr className="my-3" />
                            <div className="font-bold mb-2">Vocabulary</div>
                            <ul className="list-inside list-disc">
                              {data.voc.map((voc: any) => (
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
                          </>
                        )}

                        {data.wor.length > 0 && (
                          <>
                            <hr className="my-3" />
                            <div className="font-bold mb-2">Word</div>
                            <ul className="list-inside list-disc">
                              {data.wor.map((wor: any) => (
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
                          </>
                        )}

                        {data.inf.length > 0 && (
                          <>
                            <hr className="my-3" />
                            <div className="font-bold mb-2">Informal</div>
                            <ul className="list-inside list-disc">
                              {data.inf.map((inf: any) => (
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
                          </>
                        )}

                        {data.sla.length > 0 && (
                          <>
                            <hr className="my-3" />
                            <div className="font-bold mb-2">Slang</div>
                            <ul className="list-inside list-disc">
                              {data.sla.map((sla: any) => (
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
                          </>
                        )}

                        {data.sen.length > 0 && (
                          <>
                            <hr className="my-3" />
                            <div className="font-bold mb-2">Sentence</div>
                            <ul className="list-inside list-disc">
                              {data.sen.map((sen: any) => (
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
                          </>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default SearchGlobal;
