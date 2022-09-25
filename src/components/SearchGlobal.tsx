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
  const [data, setData] = useState([]);
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
    const data = await fetch(
      `/api/vocabulary/search?q=${value}&language=${language}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setIsLoading(false);
        return res.data;
      });

    setData(data.hits);
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

                        {!isLoading && (
                          <ul className="list-inside list-disc">
                            {data.map((voc: any) => (
                              <li key={voc.id} className="pb-2">
                                <Link
                                  href={`/dictionary/${voc.languageSlug}/${voc.slug}`}
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
