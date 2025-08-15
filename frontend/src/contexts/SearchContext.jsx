import React, { createContext, useContext, useState } from 'react';

// Create a context for search functionality
export const SearchContext = createContext({
  searchQuery: '',
  setSearchQuery: () => {},
});

// Custom hook to use the search context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Provider component for the search context
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const contextValue = {
    searchQuery,
    setSearchQuery,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};