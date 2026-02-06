import { HeapItem } from "@/utils/heapUtils";

interface InputStackProps {
  items: HeapItem[];
  onAddItem: (weight: number) => void;
}

import { useState } from "react";

const InputStack = ({ items, onAddItem }: InputStackProps) => {
  const [weight, setWeight] = useState("");

  const handleAdd = () => {
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0) {
      onAddItem(w);
      setWeight("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Input Stack
      </h2>

      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-32 flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Stack is empty
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-stack-bg border border-border animate-slide-up"
            >
              <span className="text-sm font-medium truncate mr-2">
                Person {item.personId}
              </span>
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {item.weight}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground font-mono">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default InputStack;
