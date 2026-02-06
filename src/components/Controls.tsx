import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ChevronDown,
  Gauge,
  ArrowRightToLine,
} from "lucide-react";

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
    <div className="w-full bg-card border border-border rounded-xl shadow-sm p-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!canPlay && !isPlaying}
            className={`
              group flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
              ${
                isPlaying
                  ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20"
                  : "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/20"
              }
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-95
            `}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={isPlaying || !canPlay}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Step Forward"
          >
            <SkipForward size={18} />
          </button>

          <div className="w-px h-6 bg-border mx-1"></div>

          <button
            onClick={onExtractAll}
            disabled={!canExtract || isPlaying}
            className={`
              flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95
              ${
                isExtracting
                  ? "bg-secondary text-secondary-foreground cursor-wait"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20"
              }
              disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed
            `}
          >
            {isExtracting ? (
              <ChevronDown size={16} className="animate-bounce" />
            ) : (
              <ArrowRightToLine size={16} className="rotate-90" />
            )}
            <span className="hidden sm:inline">
              {isExtracting ? "Extracting..." : "Extract Max"}
            </span>
            <span className="sm:hidden">
              {isExtracting ? "..." : "Extract"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 h-10 border border-border/50">
            <Gauge size={14} className="text-muted-foreground" />
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="bg-transparent text-xs sm:text-sm font-medium text-foreground focus:outline-none cursor-pointer w-[60px]"
              aria-label="Playback Speed"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1.0x</option>
              <option value={500}>2.0x</option>
              <option value={200}>5.0x</option>
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-destructive hover:bg-destructive/10 transition-colors active:scale-95"
            title="Reset All"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
