import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { flushSync } from "react-dom"; // Add this import
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

  const rafRef = useRef(null);
  const lastTickTime = useRef(0);

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

        flushSync(() => {
          setHighlightIndices({
            current: activeHeapIndex,
            target: targetIndex,
          });
          if (swapped) {
            setHeapData(newHeap);
            setActiveHeapIndex(nextIndex);
          } else {
            setActiveHeapIndex(null);
            setHighlightIndices({ current: null, target: null });
          }
        });
        return;
      }

      if (inputIndex < inputData.length) {
        setAlgorithmMode("BUILDING");
        const newItem = inputData[inputIndex];
        const newHeap = [...heapData, newItem];

        flushSync(() => {
          setHeapData(newHeap);
          setActiveHeapIndex(newHeap.length - 1);
          setInputIndex((prev) => prev + 1);
        });
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

        flushSync(() => {
          setHeapData(newHeap);
          setSortedData((prev) => [maxItem, ...prev]);
          if (newHeap.length > 0) {
            setActiveHeapIndex(0);
          }
        });
        return;
      }

      const { newHeap, nextIndex, swapped, targetIndex } = stepHeapifyDown(
        heapData,
        activeHeapIndex,
      );

      flushSync(() => {
        setHighlightIndices({ current: activeHeapIndex, target: targetIndex });
        if (swapped) {
          setHeapData(newHeap);
          setActiveHeapIndex(nextIndex);
        } else {
          setActiveHeapIndex(null);
          setHighlightIndices({ current: null, target: null });
        }
      });
    }
  }, [algorithmMode, heapData, inputData, inputIndex, activeHeapIndex]);

  const animate = useCallback(
    (timestamp) => {
      if (!lastTickTime.current) lastTickTime.current = timestamp;
      const delta = timestamp - lastTickTime.current;

      if (delta >= speed) {
        tick();
        lastTickTime.current = timestamp;
      }

      if (isPlay && algorithmMode !== "DONE") {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [isPlay, algorithmMode, tick, speed],
  );

  useEffect(() => {
    if (isPlay && algorithmMode !== "DONE") {
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlay, algorithmMode, animate]);

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
        speed,
        setSpeed,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useGraphData = () => useContext(DataContext);
