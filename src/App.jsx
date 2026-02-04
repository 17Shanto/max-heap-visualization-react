import React from "react";
import TreeGraph from "./components/Tree/TreeGraph";
import Handler from "./components/Handler/Handler";
import { DataProvider } from "./context/DataContext";

const App = () => {
  return (
    <DataProvider>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 p-4">
            <Handler></Handler>
          </div>
          <div className="lg:col-span-3">
            <TreeGraph></TreeGraph>
          </div>
        </div>
      </div>
    </DataProvider>
  );
};

export default App;
