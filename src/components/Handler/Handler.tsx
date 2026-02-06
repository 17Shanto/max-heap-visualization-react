import React, { useRef, useState } from "react";
import { useGraphData } from "../../context/DataContext";
import initialData from "../../../public/data";
import { FaPlay, FaPause, FaSortAmountDown } from "react-icons/fa";
import { MdOutlineResetTv } from "react-icons/md";
import { Slider } from "../ui/slider";

const Handler = () => {
  const [idCounter, setIdCounter] = useState(31);
  const {
    inputData,
    heapData,
    updateInputData,
    isPlay,
    setIsPlay,
    resetVisualization,
    startExtraction,
    algorithmMode,
    inputIndex,
    speed,
    setSpeed,
  } = useGraphData();

  const [isResetting, setIsResetting] = useState(false);
  const weightInputRef = useRef<HTMLInputElement>(null);

  const handleTogglePlay = () => {
    setIsPlay(!isPlay);
  };

  const handleSubmit = () => {
    const value = weightInputRef.current?.value;
    if (!value) return;

    setIdCounter((prev) => prev + 1);
    const weightValue = parseFloat(value);
    const newData = [
      ...inputData,
      { personId: idCounter, weight: weightValue },
    ];
    updateInputData(newData);
    if (weightInputRef.current) weightInputRef.current.value = "";
  };

  const handleReset = () => {
    setIsResetting(true);
    resetVisualization();
    setTimeout(() => {
      updateInputData(initialData);
      setIsResetting(false);
    }, 500);
  };

  const isBuilding = algorithmMode === "IDLE" || algorithmMode === "BUILDING";
  const isExtracting = algorithmMode === "EXTRACTING";
  const isDone = algorithmMode === "DONE";
  const isBuildComplete = inputIndex >= inputData.length && heapData.length > 0;

  const getPlayButtonText = () => {
    if (isPlay) return "Pause";
    if (isExtracting) return "Resume Sort";
    if (isDone) return "Done";
    if (inputIndex < inputData.length) return "Play Build";
    return "Play";
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-foreground">Add New Weight</h1>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Weight (e.g. 85)"
            ref={weightInputRef}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button onClick={handleSubmit} className="h-10 px-4 rounded-md bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors">
            Add
          </button>
        </div>
      </div>

      <div className="border-t border-border my-2" />
      <span className="text-xs text-muted-foreground text-center -mt-4 -mb-2">Controls</span>

      <div>
        <label className="text-xs text-muted-foreground flex justify-between mb-1">
          <span>Speed</span>
          <span>{speed}ms</span>
        </label>
        <Slider
          min={100}
          max={2000}
          step={100}
          value={[speed]}
          onValueChange={([v]) => setSpeed(v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleTogglePlay}
          disabled={isDone && inputIndex >= inputData.length}
          className={`flex items-center justify-center gap-2 h-10 px-4 rounded-md font-medium transition-colors disabled:opacity-50 ${isPlay ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
        >
          {isPlay ? <FaPause /> : <FaPlay />}
          {getPlayButtonText()}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50"
          disabled={isResetting}
        >
          {isResetting ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <>
              <MdOutlineResetTv className="text-xl text-blue-500" /> Reset
            </>
          )}
        </button>
      </div>

      <div className="mt-2">
        <h1 className="text-xl font-semibold mb-2 text-foreground">Heap Sort Phase</h1>
        <button
          onClick={startExtraction}
          disabled={!isBuildComplete || isExtracting || isDone}
          className="flex items-center justify-center gap-2 w-full h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <FaSortAmountDown /> Extract All (Sort)
        </button>

        <div className="text-xs text-muted-foreground mt-2 h-4">
          {isExtracting && (
            <span className="text-primary font-semibold animate-pulse">
              Sorting in progress... (Heapify Down)
            </span>
          )}
          {isDone && (
            <span className="text-green-600 font-bold">Sorting Complete!</span>
          )}
          {isBuilding && !isBuildComplete && "Building Max Heap..."}
          {isBuilding && isBuildComplete && "Tree Built. Ready to Extract."}
        </div>
      </div>
    </div>
  );
};

export default Handler;
