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

type Mode = "idle" | "inserting" | "extracting";
type Theme = "dark" | "light";

const Index = () => {
  // --- Theme State ---
  const [theme, setTheme] = useState<Theme>("light");

  // --- Heap Sort State ---
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

  // --- Theme Effect ---
  // This toggles the 'dark' class on the HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Keep ref in sync
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

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-primary hover:text-accent-foreground transition-colors border border-transparent hover:border-border"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {" "}
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              // Moon Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
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
