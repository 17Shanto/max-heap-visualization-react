import React, { useState, useEffect } from "react";
import TreeGraph from "./components/Tree/TreeGraph";
import Handler from "./components/Handler/Handler";
import { DataProvider } from "./context/DataContext";
import InputStack from "./components/InputStack/InputStack";
import { FaSun, FaMoon } from "react-icons/fa";

const App = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 transition-colors duration-300">
      <div className="w-full bg-base-100 shadow-xl border border-base-300 overflow-hidden">
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
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-1 p-4">
                <div className="flex justify-between items-center mb-4 bg-base-200 p-3 rounded-lg">
                  <span className="text-xl font-semibold opacity-70">
                    Theme
                  </span>
                  <label className="swap swap-rotate">
                    <input
                      type="checkbox"
                      onChange={toggleTheme}
                      checked={theme === "dark"}
                    />
                    <FaSun className="swap-on fill-current w-6 h-6 text-yellow-500" />
                    <FaMoon className="swap-off fill-current w-6 h-6 text-blue-500" />
                  </label>
                </div>
                <Handler></Handler>
              </div>
              <div className="lg:col-span-3">
                <div className="">
                  <InputStack></InputStack>
                </div>
                <div className="">
                  <TreeGraph></TreeGraph>
                </div>
              </div>
            </div>
          </div>
        </DataProvider>
        <div className="px-6 py-3 bg-base-200 border-t border-base-300 flex justify-between text-xs text-base-content/60">
          <span>Scale: 100%</span>
          <span>Status: Live Rendering</span>
        </div>
      </div>
    </div>
  );
};

export default App;
