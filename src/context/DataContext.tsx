import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import initialData from "../../public/data";
import { stepHeapifyUp, stepHeapifyDown, type HeapNode } from "../utils/utils";

interface HighlightIndices {
  current: number | null;
  target: number | null;
}

interface DataContextType {
  inputData: HeapNode[];
  heapData: HeapNode[];
  sortedData: HeapNode[];
  updateInputData: (newData: HeapNode[]) => void;
  isPlay: boolean;
  setIsPlay: (v: boolean) => void;
  algorithmMode: string;
  inputIndex: number;
  startExtraction: () => void;
  resetVisualization: () => void;
  highlightIndices: HighlightIndices;
  speed: number;
  setSpeed: (v: number) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [inputData, setInputData] = useState<HeapNode[]>(initialData);
  const [heapData, setHeapData] = useState<HeapNode[]>([]);
  const [sortedData, setSortedData] = useState<HeapNode[]>([]);

  const [isPlay, setIsPlay] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [algorithmMode, setAlgorithmMode] = useState("IDLE");
  const [inputIndex, setInputIndex] = useState(0);
  const [activeHeapIndex, setActiveHeapIndex] = useState<number | null>(null);
  const [highlightIndices, setHighlightIndices] = useState<HighlightIndices>({
    current: null,
    target: null,
  });

  const rafRef = useRef<number | null>(null);
  const lastTickTime = useRef(0);

  const updateInputData = (newData: HeapNode[]) => {
    setInputData(newData);
    if (algorithmMode === "DONE") {
      setAlgorithmMode("IDLE");
    }
  };

  const startExtraction = () => {
    if (heapData.length > 0) {
      setAlgorithmMode("EXTRACTING");
      setIsPlay(true);
      setActiveHeapIndex(null);
    }
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
      if (activeHeapIndex !== null) {
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
        return;
      }

      if (heapData.length > 0) {
        const newHeap = [...heapData];
        const lastIdx = newHeap.length - 1;
        [newHeap[0], newHeap[lastIdx]] = [newHeap[lastIdx], newHeap[0]];
        const maxItem = newHeap.pop()!;

        setHeapData(newHeap);
        setSortedData((prev) => [maxItem, ...prev]);

        if (newHeap.length > 0) {
          setActiveHeapIndex(0);
        }
        return;
      }

      setAlgorithmMode("DONE");
      setIsPlay(false);
    }
  }, [algorithmMode, heapData, inputData, inputIndex, activeHeapIndex]);

  const animate = useCallback(
    (timestamp: number) => {
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
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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

export const useGraphData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useGraphData must be used within DataProvider");
  return ctx;
};
