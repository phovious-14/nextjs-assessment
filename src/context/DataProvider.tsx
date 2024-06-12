"use client"
import { createContext, useContext, useState } from 'react';

// Create a context with default value
const DataContext = createContext(null);

// Create a provider component
export const DataProvider = ({ children }:any) => {
  const [data, setData] = useState(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to use the DataContext
export const useData = () => useContext(DataContext);
