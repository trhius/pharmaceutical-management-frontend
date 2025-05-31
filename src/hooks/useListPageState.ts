import { useState, useCallback, useMemo, useEffect } from 'react'; // Import useEffect

// Define a generic type for the list request that must include pagination and optional search fields
interface BaseListRequest {
  page?: number;
  size?: number;
  // searchBy type should be flexible, allow string and let consuming components narrow it
  searchBy?: string | undefined;
  search?: string;
  sortBy?: string; // Add sortBy
  sortOrder?: 'ASC' | 'DESC'; // Add sortOrder with allowed values
  [key: string]: any; // Allow other properties
}

interface UseListPageStateOptions<TFilterRequest extends BaseListRequest> {
  initialPage?: number;
  initialSize?: number;
  initialSearch?: string;
  initialSearchBy?: TFilterRequest['searchBy'];
  initialSortBy?: TFilterRequest['sortBy']; // Add initialSortBy
  initialSortOrder?: TFilterRequest['sortOrder']; // Add initialSortOrder
  initialFilters?: Partial<Omit<TFilterRequest, keyof BaseListRequest>>; // Other filters
  resetPageIndexOnFilterChange?: boolean; // Option to reset page on external filter changes
  debounceDelay?: number; // New: Add debounce delay option
}

interface UseListPageStateReturn<TFilterRequest extends BaseListRequest> {
  filter: TFilterRequest;
  pageIndex: number;
  pageSize: number;
  searchTerm: string; // The immediate value of the search input
  searchByValue: TFilterRequest['searchBy'] | undefined;
  sortBy: string | undefined; // Add sortBy state
  sortOrder: 'ASC' | 'DESC' | undefined; // Add sortOrder state
  setPageIndex: (newPage: number) => void;
  setPageSize: (newSize: number) => void;
  setSearchTerm: (newSearch: string) => void; // Function to update the immediate search term
  setSearchByValue: (newSearchBy: TFilterRequest['searchBy'] | undefined) => void;
  setSortBy: (newSortBy: TFilterRequest['sortBy'] | undefined) => void; // Add setSortBy function
  setSortOrder: (newSortOrder: 'ASC' | 'DESC' | undefined) => void; // Add setSortOrder function
  setExternalFilters: (filters: Partial<Omit<TFilterRequest, keyof BaseListRequest>>) => void;
}

function useListPageState<TFilterRequest extends BaseListRequest>(
  options?: UseListPageStateOptions<TFilterRequest>
): UseListPageStateReturn<TFilterRequest> {
  const {
    initialPage = 0,
    initialSize = 10,
    initialSearch = '',
    initialSearchBy,
    initialSortBy, // Destructure initialSortBy
    initialSortOrder, // Destructure initialSortOrder
    initialFilters = {},
    resetPageIndexOnFilterChange = true,
    debounceDelay = 500, // Default debounce delay to 500ms
  } = options || {};

  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [searchTerm, setSearchTerm] = useState(initialSearch); // This holds the immediate input value
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch); // This holds the debounced value
  const [searchByValue, setSearchByValue] = useState<TFilterRequest['searchBy'] | undefined>(initialSearchBy);
  const [sortBy, setSortBy] = useState<TFilterRequest['sortBy'] | undefined>(initialSortBy); // Add sortBy state
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | undefined>(initialSortOrder); // Add sortOrder state
  const [externalFilters, setExternalFilters] =
    useState<Partial<Omit<TFilterRequest, keyof BaseListRequest>>>(initialFilters);

  // Effect to debounce the searchTerm
  // This useEffect will run whenever `searchTerm` or `debounceDelay` changes.
  // It sets a timer to update `debouncedSearchTerm` after `debounceDelay` milliseconds.
  // If `searchTerm` changes again before the timer fires, the previous timer is cleared,
  // effectively delaying the update until the user pauses typing.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    // Cleanup function: This runs if `searchTerm` changes before the delay,
    // or when the component using the hook unmounts. It clears the pending timer.
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceDelay]); // Dependencies for this effect

  // Combine all filter states into a single filter object
  // This `filter` object is the one that will be passed to your API calls.
  // It now uses `debouncedSearchTerm` to trigger API calls only after the debounce delay.
  const filter = useMemo(() => {
    // Start with external filters, as they might contain initial values or other specific fields
    const combined: TFilterRequest = {
      ...(externalFilters as TFilterRequest),
    };

    // Add sorting parameters if defined
    if (sortBy !== undefined) {
      combined.sortBy = sortBy;
    }
    if (sortOrder !== undefined) {
      combined.sortOrder = sortOrder;
    }

    // Add pagination
    combined.page = pageIndex;
    combined.size = pageSize;

    // Add search term and searchBy if debouncedSearchTerm is not empty
    // The API call will be made with this debounced value.
    if (debouncedSearchTerm) {
      combined.search = debouncedSearchTerm;
      // Use the selected searchByValue if available, otherwise use the initialSearchBy if provided
      // Ensure searchBy is only included if a search term is present and a searchBy is defined
      if (searchByValue !== undefined) {
        combined.searchBy = searchByValue;
      } else if (initialSearchBy !== undefined) {
        combined.searchBy = initialSearchBy;
      } else {
        // If no searchBy is selected or initial, and there's a search term, clear searchBy
        delete combined.searchBy;
      }
    } else {
      // If debounced search term is empty, clear search and searchBy from the filter object
      delete combined.search;
      delete combined.searchBy;
    }

    return combined;
  }, [pageIndex, pageSize, debouncedSearchTerm, searchByValue, sortBy, sortOrder, externalFilters, initialSearchBy]); // Add sortBy and sortOrder to dependencies

  // Wrapped setters to optionally reset pageIndex when filter criteria change.
  // This ensures that when a user types in a search or applies a filter,
  // they are taken back to the first page of results.

  const setPageIndexWithReset = useCallback((newPage: number) => {
    setPageIndex(newPage);
  }, []);

  const setPageSizeWithReset = useCallback(
    (newSize: number) => {
      setPageSize(newSize);
      if (resetPageIndexOnFilterChange) {
        setPageIndex(0); // Reset page to 0 when page size changes
      }
    },
    [resetPageIndexOnFilterChange]
  );

  const setSearchTermWithReset = useCallback(
    (newSearch: string) => {
      setSearchTerm(newSearch); // Update the immediate input value
      if (resetPageIndexOnFilterChange) {
        setPageIndex(0); // Reset page to 0 when search term changes
      }
    },
    [resetPageIndexOnFilterChange]
  );

  const setSearchByValueWithReset = useCallback(
    (newSearchBy: TFilterRequest['searchBy'] | undefined) => {
      setSearchByValue(newSearchBy);
      if (resetPageIndexOnFilterChange) {
        setPageIndex(0); // Reset page to 0 when searchBy option changes
      }
    },
    [resetPageIndexOnFilterChange]
  );

  // Add setters for sorting parameters with optional page reset
  const setSortByWithReset = useCallback(
    (newSortBy: TFilterRequest['sortBy'] | undefined) => {
      setSortBy(newSortBy);
      if (resetPageIndexOnFilterChange) {
        setPageIndex(0); // Reset page to 0 when sortBy changes
      }
    },
    [resetPageIndexOnFilterChange]
  );

  const setSortOrderWithReset = useCallback(
    (newSortOrder: TFilterRequest['sortOrder'] | undefined) => {
      setSortOrder(newSortOrder);
      if (resetPageIndexOnFilterChange) {
        setPageIndex(0); // Reset page to 0 when sortOrder changes
      }
    },
    [resetPageIndexOnFilterChange]
  );

  const setExternalFiltersWithReset = useCallback(
    (newFilters: Partial<Omit<TFilterRequest, keyof BaseListRequest>>) => {
      setExternalFilters(newFilters);
      if (resetPageIndexOnFilterChange) {
        setPageIndex(0); // Reset page to 0 when external filters change
      }
    },
    [setExternalFilters, setPageIndex, resetPageIndexOnFilterChange]
  );

  return {
    filter, // This is the debounced filter object used for API calls
    pageIndex,
    pageSize,
    searchTerm, // This is the immediate input value (for controlled components)
    searchByValue,
    sortBy, // Return sortBy state
    sortOrder, // Return sortOrder state
    setPageIndex: setPageIndexWithReset,
    setPageSize: setPageSizeWithReset,
    setSearchTerm: setSearchTermWithReset, // This setter updates the immediate search term
    setSearchByValue: setSearchByValueWithReset,
    setSortBy: setSortByWithReset, // Return setSortBy function
    setSortOrder: setSortOrderWithReset, // Return setSortOrder function
    setExternalFilters: setExternalFiltersWithReset,
  };
}

export default useListPageState;
