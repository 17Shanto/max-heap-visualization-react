import React, { useRef, useState } from "react";
import { useGraphData } from "../../context/DataContext";
import initialData from "../../../public/data";
import { FaPlay, FaPause, FaSortAmountDown } from "react-icons/fa";
import { MdOutlineResetTv } from "react-icons/md";

const Handler = () => {
  const [idCounter, setIdCounter] = useState(31);
  const {
    inputData,
    updateInputData,
    isPlay,
    setIsPlay,
    resetVisualization,
    startExtraction,
    algorithmMode,
    inputIndex,
  } = useGraphData();

  const [isResetting, setIsResetting] = useState(false);
  const weightInputRef = useRef(null);

  const handleTogglePlay = () => {
    setIsPlay(!isPlay);
  };

  const handleSubmit = () => {
    const value = weightInputRef.current.value;
    if (!value) return;

    setIdCounter((prev) => prev + 1);
    const weightValue = parseFloat(value);
    const newData = [
      ...inputData,
      { personId: idCounter, weight: weightValue },
    ];
    updateInputData(newData);
    weightInputRef.current.value = "";
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
  const isBuildComplete =
    inputIndex >= inputData.length && inputData.length > 0;

  const getPlayButtonText = () => {
    if (isPlay) return "Pause";
    if (isExtracting) return "Resume Sort";
    if (isDone) return "Done";
    return "Play Build";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <h1 className="fieldset-legend text-2xl mb-2">Add New Weight</h1>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Weight (e.g. 85)"
            ref={weightInputRef}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button onClick={handleSubmit} className="btn btn-warning">
            Add
          </button>
        </div>
      </div>

      <div className="divider">Controls</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleTogglePlay}
          disabled={isDone}
          className={`btn ${isPlay ? "btn-error" : "btn-success"} w-full`}
        >
          {isPlay ? <FaPause /> : <FaPlay />}
          {getPlayButtonText()}
        </button>

        <button
          onClick={handleReset}
          className="btn btn-ghost border-base-300 w-full"
          disabled={isResetting}
        >
          {isResetting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <MdOutlineResetTv className="text-xl" /> Reset
            </>
          )}
        </button>
      </div>
      <div className="mt-2">
        <h1 className="fieldset-legend text-xl mb-2">Heap Sort Phase</h1>
        <button
          onClick={startExtraction}
          disabled={!isBuildComplete || isExtracting || isDone}
          className="btn btn-primary w-full"
        >
          <FaSortAmountDown /> Extract All (Sort)
        </button>

        <div className="text-xs text-slate-500 mt-2 h-4">
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
