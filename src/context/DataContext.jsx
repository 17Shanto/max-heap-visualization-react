import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import initialData from "../../public/data";
import { stepHeapifyUp, stepHeapifyDown } from "../utils/utils";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [inputData, setInputData] = useState(initialData);
  const [heapData, setHeapData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [algorithmMode, setAlgorithmMode] = useState("IDLE");

  const [inputIndex, setInputIndex] = useState(0);
  const [activeHeapIndex, setActiveHeapIndex] = useState(null);

  const [highlightIndices, setHighlightIndices] = useState({
    current: null,
    target: null,
  });

  const updateInputData = (newData) => {
    setInputData(newData);
    if (algorithmMode === "DONE") {
      setAlgorithmMode("BUILDING");
    }
  };

  const startExtraction = () => {
    setAlgorithmMode("EXTRACTING");
    setIsPlay(true);
    setActiveHeapIndex(null);
  };

  const resetVisualization = () => {
    setIsPlay(false);
    setHeapData([]);
    setSortedData([]);
    setInputIndex(0);
    setActiveHeapIndex(null);
    setAlgorithmMode("IDLE");
    setHighlightIndices({ current: null, target: null });
  };

  const tick = useCallback(() => {
    if (algorithmMode === "IDLE" || algorithmMode === "BUILDING") {
      if (activeHeapIndex !== null) {
        setAlgorithmMode("BUILDING");
        const { newHeap, nextIndex, swapped, targetIndex } = stepHeapifyUp(
          heapData,
          activeHeapIndex,
        );
        setHighlightIndices({ current: activeHeapIndex, target: targetIndex });

        if (swapped) {
          setHeapData(newHeap);
          setActiveHeapIndex(nextIndex);
        } else {
          setActiveHeapIndex(null);
          setHighlightIndices({ current: null, target: null });
        }
        return;
      }

      if (inputIndex < inputData.length) {
        setAlgorithmMode("BUILDING");
        const newItem = inputData[inputIndex];
        const newHeap = [...heapData, newItem];
        setHeapData(newHeap);
        setActiveHeapIndex(newHeap.length - 1);
        setInputIndex((prev) => prev + 1);
        return;
      }

      setAlgorithmMode("IDLE");
      setIsPlay(false);
      setHighlightIndices({ current: null, target: null });
    }

    if (algorithmMode === "EXTRACTING") {
      if (activeHeapIndex === null) {
        if (heapData.length === 0) {
          setAlgorithmMode("DONE");
          setIsPlay(false);
          return;
        }

        const newHeap = [...heapData];
        const lastIdx = newHeap.length - 1;
        [newHeap[0], newHeap[lastIdx]] = [newHeap[lastIdx], newHeap[0]];
        const maxItem = newHeap.pop();
        setHeapData(newHeap);
        setSortedData((prev) => [maxItem, ...prev]);
        if (newHeap.length > 0) {
          setActiveHeapIndex(0);
        }
        return;
      }

      const { newHeap, nextIndex, swapped, targetIndex } = stepHeapifyDown(
        heapData,
        activeHeapIndex,
      );
      setHighlightIndices({ current: activeHeapIndex, target: targetIndex });

      if (swapped) {
        setHeapData(newHeap);
        setActiveHeapIndex(nextIndex);
      } else {
        setActiveHeapIndex(null);
        setHighlightIndices({ current: null, target: null });
      }
    }
  }, [algorithmMode, heapData, inputData, inputIndex, activeHeapIndex]);

  useEffect(() => {
    let interval;
    if (isPlay && algorithmMode !== "DONE") {
      interval = setInterval(tick, speed);
    }
    return () => clearInterval(interval);
  }, [isPlay, algorithmMode, tick, speed]);

  return (
    <DataContext.Provider
      value={{
        inputData,
        heapData,
        sortedData,
        updateInputData,
        isPlay,
        setIsPlay,
        algorithmMode,
        inputIndex,
        startExtraction,
        resetVisualization,
        highlightIndices,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useGraphData = () => useContext(DataContext);
