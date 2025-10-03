import React, { createContext, useState, useCallback, useContext } from 'react';

// Create the context
const LoadingContext = createContext();

// Create the provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // useCallback ensures these functions don't change on every render
  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  const value = { isLoading, showLoader, hideLoader };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};