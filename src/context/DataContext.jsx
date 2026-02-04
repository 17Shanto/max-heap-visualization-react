import React, { createContext, useState } from "react";
import data from "../../public/data";
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [graphData, setGraphData] = useState(data);
  const updateGraphData = (newData) => {
    setGraphData(newData);
  };

  return (
    <DataContext.Provider value={{ graphData, updateGraphData }}>
      {children}
    </DataContext.Provider>
  );
};
