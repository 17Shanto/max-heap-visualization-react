import React from "react";
import TreeGraph from "./components/Tree/TreeGraph";

const App = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 p-4">
          <h1>Hello</h1>
        </div>
        <div className="lg:col-span-3">
          <TreeGraph></TreeGraph>
        </div>
      </div>
    </div>
  );
};

export default App;
