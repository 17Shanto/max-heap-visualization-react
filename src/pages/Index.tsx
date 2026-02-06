import { useState, useCallback, useRef, useEffect } from "react";
import InputStack from "@/components/InputStack";
import TreeVisualization from "@/components/TreeVisualization";
import SortedList from "@/components/SortedList";
import Controls from "@/components/Controls";
import {
  HeapItem,
  HeapStep,
  getDefaultData,
  generateId,
  getNextPersonId,
  resetPersonIdCounter,
  generateInsertionSteps,
  generateExtractionSteps,
} from "@/utils/heapUtils";
import { FaSun } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";

type Mode = "idle" | "inserting" | "extracting";
type Theme = "dark" | "light";

const Index = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [inputStack, setInputStack] = useState<HeapItem[]>(() =>
    getDefaultData(),
  );
  const [heap, setHeap] = useState<HeapItem[]>([]);
  const [sortedList, setSortedList] = useState<HeapItem[]>([]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<string>("idle");

  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [speed, setSpeed] = useState(1000);

  const stepsRef = useRef<HeapStep[]>([]);
  const stepIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyStep = useCallback((step: HeapStep) => {
    setHeap(step.heap);
    setInputStack(step.inputStack);
    setSortedList(step.sortedList);
    setHighlightedIndices(step.highlightedIndices);
    setMessage(step.message);
    setPhase(step.phase);
  }, []);

  const playNextStep = useCallback(() => {
    if (!isPlayingRef.current) return;

    if (stepIndexRef.current >= stepsRef.current.length) {
      // Done
      setIsPlaying(false);
      setHighlightedIndices([]);
      setMode("idle");
      setPhase("done");
      setMessage("✅ Complete!");
      return;
    }

    const step = stepsRef.current[stepIndexRef.current];
    stepIndexRef.current += 1;
    applyStep(step);

    timerRef.current = setTimeout(playNextStep, speed);
  }, [applyStep, speed]);

  const handlePlay = useCallback(() => {
    if (isPlaying) return;

    if (mode === "idle" || mode === "inserting") {
      const steps = generateInsertionSteps(heap, inputStack, sortedList);
      if (steps.length === 0) return;

      stepsRef.current = steps;
      stepIndexRef.current = 0;
      setMode("inserting");
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    timerRef.current = setTimeout(playNextStep, 100);
  }, [isPlaying, mode, heap, inputStack, sortedList, playNextStep]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    clearTimer();
  }, [clearTimer]);

  const handleExtractAll = useCallback(() => {
    if (heap.length === 0) return;

    const steps = generateExtractionSteps(heap, inputStack, sortedList);
    if (steps.length === 0) return;

    stepsRef.current = steps;
    stepIndexRef.current = 0;
    setMode("extracting");
    setIsPlaying(true);
    isPlayingRef.current = true;

    timerRef.current = setTimeout(playNextStep, 100);
  }, [heap, inputStack, sortedList, playNextStep]);

  const handleStepForward = useCallback(() => {
    if (
      stepsRef.current.length === 0 ||
      stepIndexRef.current >= stepsRef.current.length
    ) {
      if (mode === "idle" || mode === "inserting") {
        const steps = generateInsertionSteps(heap, inputStack, sortedList);
        if (steps.length === 0) return;
        stepsRef.current = steps;
        stepIndexRef.current = 0;
        setMode("inserting");
      } else {
        return;
      }
    }

    if (stepIndexRef.current < stepsRef.current.length) {
      const step = stepsRef.current[stepIndexRef.current];
      stepIndexRef.current += 1;
      applyStep(step);

      if (stepIndexRef.current >= stepsRef.current.length) {
        setMode("idle");
        setHighlightedIndices([]);
        setPhase("done");
        setMessage("✅ Complete!");
      }
    }
  }, [mode, heap, inputStack, sortedList, applyStep]);

  const handleAddItem = useCallback(
    (weight: number) => {
      const newItem: HeapItem = {
        id: generateId(),
        personId: getNextPersonId(),
        weight,
      };
      setInputStack((prev) => {
        const updated = [...prev, newItem];

        if (isPlayingRef.current && mode === "inserting") {
          const currentStepIdx = stepIndexRef.current;
          const currentStep =
            currentStepIdx > 0 ? stepsRef.current[currentStepIdx - 1] : null;

          if (currentStep) {
            const newSteps = generateInsertionSteps(
              currentStep.heap,
              [...currentStep.inputStack, newItem],
              currentStep.sortedList,
            );
            stepsRef.current = [
              ...stepsRef.current.slice(0, currentStepIdx),
              ...newSteps,
            ];
          }
        }

        return updated;
      });
    },
    [mode],
  );

  const handleReset = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setHeap([]);
    resetPersonIdCounter();
    setInputStack(getDefaultData());
    setSortedList([]);
    setHighlightedIndices([]);
    setMessage("");
    setPhase("idle");
    setMode("idle");
    stepsRef.current = [];
    stepIndexRef.current = 0;
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const canPlay = inputStack.length > 0 && !isPlaying;
  const canExtract = heap.length > 0 && !isPlaying;

  return (
    <div className="flex flex-col h-dvh bg-background lg:overflow-hidden overflow-y-auto transition-colors duration-300">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">
              H
            </span>
          </div>
          <h1 className="font-display font-bold text-base lg:text-lg text-foreground">
            Heap Sort Visualizer
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] lg:text-xs font-mono text-muted-foreground hidden sm:inline-block">
            Max-Heap · Descending Order
          </span>

          <span className="font-bold">Theme</span>
          <button
            onClick={toggleTheme}
            className="btn"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {" "}
            {theme === "dark" ? (
              <span className="text-yellow-300 text-xl">
                <FaSun />
              </span>
            ) : (
              // Moon Icon
              <span className="text-black text-2xl">
                <IoMoon />
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-shrink-0 px-4 lg:px-6 py-3">
        <Controls
          isPlaying={isPlaying}
          canPlay={canPlay}
          canExtract={canExtract}
          isExtracting={mode === "extracting"}
          onPlay={handlePlay}
          onPause={handlePause}
          onExtractAll={handleExtractAll}
          onReset={handleReset}
          onStepForward={handleStepForward}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 lg:px-6 pb-4 lg:overflow-hidden">
        <div className="w-full lg:w-72 flex-shrink-0 bg-card border border-border rounded-xl p-4 overflow-hidden h-[300px] lg:h-full transition-colors duration-300">
          <InputStack items={inputStack} onAddItem={handleAddItem} />
        </div>
        <div className="w-full lg:flex-1 bg-card border border-border rounded-xl p-4 overflow-hidden flex flex-col min-h-[400px] lg:min-h-0 h-full transition-colors duration-300">
          <TreeVisualization
            heap={heap}
            highlightedIndices={highlightedIndices}
            phase={phase}
            message={message}
          />
        </div>

        <div className="w-full lg:w-56 flex-shrink-0 bg-card border border-border rounded-xl p-4 overflow-hidden h-[200px] lg:h-full transition-colors duration-300">
          <SortedList items={sortedList} />
        </div>
      </div>
    </div>
  );
};

export default Index;
