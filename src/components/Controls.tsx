import { Play, Pause, SkipForward, RotateCcw, ChevronDown } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  canPlay: boolean;
  canExtract: boolean;
  isExtracting: boolean;
  onPlay: () => void;
  onPause: () => void;
  onExtractAll: () => void;
  onReset: () => void;
  onStepForward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const Controls = ({
  isPlaying,
  canPlay,
  canExtract,
  isExtracting,
  onPlay,
  onPause,
  onExtractAll,
  onReset,
  onStepForward,
  speed,
  onSpeedChange,
}: ControlsProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border">
      {/* Play/Pause */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={!canPlay && !isPlaying}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        title={isPlaying ? "Pause" : "Play (Insert into Heap)"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* Step Forward */}
      <button
        onClick={onStepForward}
        disabled={isPlaying || !canPlay}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Step Forward"
      >
        <SkipForward size={18} />
      </button>

      {/* Extract All */}
      <button
        onClick={onExtractAll}
        disabled={!canExtract || isPlaying}
        className="flex items-center gap-1.5 px-4 h-10 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
        title="Extract All (Heapify Down)"
      >
        <ChevronDown size={16} />
        {isExtracting ? "Extracting..." : "Extract All"}
      </button>

      {/* Speed control */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground font-mono">Speed</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="px-2 py-1 rounded-md bg-muted border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1x</option>
          <option value={500}>2x</option>
          <option value={250}>4x</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        title="Reset"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default Controls;
