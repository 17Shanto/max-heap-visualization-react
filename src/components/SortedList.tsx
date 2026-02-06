import { HeapItem } from "@/utils/heapUtils";

interface SortedListProps {
  items: HeapItem[];
}

const SortedList = ({ items }: SortedListProps) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Sorted (Descending)
      </h2>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No items sorted yet
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-sorted-bg border border-border animate-slide-up"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-accent font-bold w-5">
                  {index + 1}.
                </span>
                <span className="text-sm font-medium truncate">Person {item.personId}</span>
              </div>
              <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                {item.weight}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground font-mono">
          {items.length} sorted
        </span>
      </div>
    </div>
  );
};

export default SortedList;
