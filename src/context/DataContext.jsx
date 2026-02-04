import React, { createContext, useState, useContext } from "react";
import initialData from "../../public/data";

const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [graphData, setGraphData] = useState(initialData);
  const updateGraphData = (newData) => {
    setGraphData(newData);
  };

  return (
    <DataContext.Provider value={{ graphData, updateGraphData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useGraphData = () => useContext(DataContext);
