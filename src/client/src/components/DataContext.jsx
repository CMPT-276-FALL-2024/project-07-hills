import React, { createContext, useState } from "react";

// Create a Context
export const DataContext = createContext();

// Create a Provider Component
export const DataProvider = ({ children }) => {
  const [songs, setSongs] = useState([]); // Holds the list of song objects

  return (
    <DataContext.Provider value={{ songs, setSongs }}>
      {children}
    </DataContext.Provider>
  );
};