"use client"

import { createContext, useContext, useState } from 'react';

interface DataContextType {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}
// Create a context with default value
const DataContext = createContext<DataContextType | null>(null);
// Create a provider component
export const DataProvider = ({ children }:any) => {
  const [data, setData] = useState<any>(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to use the DataContext
export const useData = () => useContext(DataContext);
