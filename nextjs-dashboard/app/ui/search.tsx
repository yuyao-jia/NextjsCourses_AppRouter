'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    const handleSearch = useDebouncedCallback((term) =>{
        console.log(`Searching... ${term}`);
        const params = new URLSearchParams(searchParams);
        params.set('page','1'); // Reset to the first page when a new search is made
        //URLSearchParams is a web API that provides utility methods to work with the URL query parameters.
        // Use it to get the iterable params string instead of a complex stirng literal
        if (term) {
            params.set('query', term); // set the params string based on user's input
        } else {
            params.delete('query'); // delete input if its empty
        }
        replace(`${pathname}?${params.toString()}`); //use replace method from useRouter
      // ${pathname} = the current path
      // As user types into the search bar, params.toString() translates the input into a URL-friendly format
      // replace updates the URL with user's search data: /dashboard/invoices?query=lee if user types "Lee"
      // URL is updated without reloading the page
    }, 300); // Debounce the search input to avoid updating URL on every keystroke
    //only run code after a specific time once user has stopped typing (300ms in this case)

    return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={
            (e) => {handleSearch(e.target.value);}
        }
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
