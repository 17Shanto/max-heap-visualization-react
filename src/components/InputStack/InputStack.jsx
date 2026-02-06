import React from "react";
import { useGraphData } from "../../context/DataContext";

const InputStack = () => {
  const { graphData } = useGraphData();
  return (
    <div className="w-full p-4">
      <div className="mb-2 text-sm font-semibold text-slate-600 flex justify-between">
        <span className="text-xl">Input Array</span>
        <span className="text-xs text-slate-400">Size: {graphData.length}</span>
      </div>
      <div
        className="
          grid 
          gap-1 
          grid-cols-10           
          sm:grid-cols-15       
          md:grid-cols-30        
          lg:grid-cols-[30]     
          bg-slate-200 
          p-2 
          rounded-lg 
          border 
          border-slate-300
        "
      >
        {graphData.map((x) => (
          <div
            key={x.personId}
            className="
              aspect-square 
              bg-white 
              border 
              border-slate-300 
              flex 
              items-center 
              justify-center 
              text-xs 
              font-medium 
              text-slate-700
              shadow-sm
              hover:bg-blue-50
              hover:border-blue-400
              transition-colors
              cursor-default
              relative
              group
            "
          >
            {/* The Value */}
            {x.weight}

            {/* Optional: Index Tooltip on Hover */}
            <span className="absolute -top-6 bg-slate-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              personId:{x.personId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputStack;
