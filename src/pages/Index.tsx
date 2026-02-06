import React from "react";
import TreeGraph from "../components/Tree/TreeGraph";
import Handler from "../components/Handler/Handler";
import { DataProvider } from "../context/DataContext";
import InputStack from "../components/InputStack/InputStack";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted transition-colors duration-300">
      <div className="w-full bg-background shadow-xl border border-border overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <span className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
            Binary Tree Visualizer
          </h2>
          <div className="flex gap-2">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <DataProvider>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1 p-4">
              <Handler />
            </div>
            <div className="lg:col-span-3">
              <InputStack />
              <TreeGraph />
            </div>
          </div>
        </DataProvider>

        <div className="px-6 py-3 bg-muted border-t border-border flex justify-between text-xs text-muted-foreground">
          <span>Scale: 100%</span>
          <span>Status: Live Rendering</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
