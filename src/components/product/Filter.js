import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, Select } from "../UI/Input";
import Button from "../UI/Button";
import { useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"; // Import arrow icons
import { useGetAllCategories } from "../../hooks/categories/useGetAllCategories";
const sortOptions = [
  { value: "price_desc", label: "Price: Highest to Lowest" },
  { value: "price_asc", label: "Price: Lowest to Highest" },
  { value: "createdAt_desc", label: "Most Recent" },
  { value: "averageRating_desc", label: "Highest Rated" },
  // Add more combined sorting options here
];
const FilterComponent = ({ onFilterChange, pages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageQuery = parseInt(searchParams.get("page"));

  const [currentPage, setCurrentPage] = useState(
    pageQuery && pageQuery <= pages ? pageQuery : 1
  );
  const searchInputRef = useRef(null); // Create a ref for the input element

  // Function to validate and correct sort option
  const getValidSortOption = useCallback(
    (option) => {
      const isValidOption = sortOptions.some((opt) => opt.value === option);
      return isValidOption ? option : "createdAt_desc"; // Default sort option
    },
    [sortOptions]
  );

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  const [sortOption, setSortOption] = useState(
    getValidSortOption(searchParams.get("sortOption"))
  );
  useEffect(() => {
    // Set the input element's focus when the component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    // Whenever searchQuery or sortOption changes, update the URL search parameters
    if (searchQuery) {
      searchParams.set("searchQuery", searchQuery);
    } else {
      searchParams.delete("searchQuery"); // Remove the searchQuery parameter if the search string is empty
    }
    const validSortOption = getValidSortOption(sortOption);
    searchParams.set("sortOption", validSortOption);
    console.log("currentPage", currentPage);

    searchParams.set("page", currentPage); // Update page number in search query

    setSearchParams(searchParams);
  }, [
    searchQuery,
    sortOption,
    currentPage,
    searchParams,
    getValidSortOption,
    setSearchParams,
  ]);
  const handlePageChange = (direction) => {
    setCurrentPage(
      (prevPage) =>
        direction === "prev"
          ? Math.max(prevPage - 1, 1) // Ensure currentPage doesn't go below 1
          : Math.min(prevPage + 1, pages) // Ensure currentPage doesn't exceed the total number of pages
    );
    // You can perform additional logic here, like fetching data for the new page
    // and updating the state accordingly
  };

  return (
    <div className="flex w-full   ">
      <div className="flex flex-grow items-baseline space-x-6 ">
        <Input
          ref={searchInputRef} // Attach the ref to the input element
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="input input-bordered w-full max-w-xs"
        />
        <Select
          className="mb-4 flex items-baseline space-x-2"
          value={sortOption}
          label="sort By"
          onChange={(e) => {
            setSortOption(e.target.value);
          }}
          options={sortOptions}
        />
      </div>
    </div>
  );
};

export default FilterComponent;
