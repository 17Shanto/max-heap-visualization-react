import React, { useEffect, useRef } from "react";
import { useGraphData } from "../../context/DataContext";

const InputStack = () => {
  const { inputData, inputIndex, sortedData, algorithmMode } = useGraphData();

  const currentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [inputIndex]);

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Input Queue */}
      <div className="w-full">
        <div className="mb-2 text-sm font-semibold text-slate-600 flex justify-between items-center">
          <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded">Input Queue</span>
          <span className="text-xs text-slate-400">
            Processed: {inputIndex} / {inputData.length}
          </span>
        </div>

        <div className="flex overflow-x-auto gap-2 p-4 bg-slate-100 rounded-lg border border-slate-300 shadow-inner">
          {inputData.map((x, idx) => {
            const isProcessed = idx < inputIndex;
            const isCurrent = idx === inputIndex;

            return (
              <div
                key={`${x.personId}-${idx}`}
                ref={isCurrent ? currentRef : null}
                className={`
                  shrink-0 w-12 h-12 flex flex-col items-center justify-center 
                  rounded border transition-all duration-300
                  ${isProcessed ? "bg-slate-300 border-slate-400 opacity-50 scale-90" : "bg-white border-blue-300 shadow-sm"}
                  ${isCurrent ? "ring-2 ring-blue-500 scale-110 z-10" : ""}
                `}
              >
                <span className="text-sm font-bold">{x.weight}</span>
                <span className="text-[9px] text-slate-500">
                  ID {x.personId}
                </span>
              </div>
            );
          })}
          {inputIndex >= inputData.length && (
            <div className="flex items-center text-green-600 text-sm italic pr-4">
              All Added
            </div>
          )}
        </div>
      </div>

      {/* Sorted Output */}
      {(algorithmMode === "EXTRACTING" || algorithmMode === "DONE") && (
        <div className="w-full">
          <div className="mb-2 text-sm font-semibold text-slate-600 flex justify-between items-center">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Sorted Output (Descending)
            </span>
            <span className="text-xs text-slate-400">
              Count: {sortedData.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-inner min-h-20">
            {sortedData.map((x) => (
              <div
                key={`sorted-${x.personId}`}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
              >
                {x.weight}
              </div>
            ))}
            {sortedData.length === 0 && (
              <span className="text-slate-400 text-sm m-auto">
                Waiting for extraction...
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputStack;
