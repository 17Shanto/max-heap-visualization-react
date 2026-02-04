import React, { useState } from "react";
import { DataContext } from "./DataContext"; // Import from the other file
import data from "../../public/data";

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
