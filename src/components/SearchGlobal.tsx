import { useRef } from 'react';

const SearchGlobal = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const value = inputRef.current?.value || '';
    console.log(value);
  };

  return (
    <div className="bg-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <input
          type="text"
          className="col-span-6 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          ref={inputRef}
          onKeyUp={() => {
            handleSearch();
          }}
        />
      </div>
    </div>
  );
};

export default SearchGlobal;
