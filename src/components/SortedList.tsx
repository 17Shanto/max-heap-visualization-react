import { HeapItem } from "@/utils/heapUtils";

interface SortedListProps {
  items: HeapItem[];
}

const SortedList = ({ items }: SortedListProps) => {
  // Function to handle the download
  const handleDownload = () => {
    if (items.length === 0) return;

    // 1. Create JSON string
    const jsonString = JSON.stringify(items, null, 2);

    // 2. Create a Blob from the string
    const blob = new Blob([jsonString], { type: "application/json" });

    // 3. Create a temporary download URL
    const url = URL.createObjectURL(blob);

    // 4. Create a temporary link element and trigger click
    const link = document.createElement("a");
    link.href = url;
    link.download = "sorted-list.json"; // Filename
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Title and Download Button */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground">
          Sorted (Descending)
        </h2>

        {items.length > 0 && (
          <button
            onClick={handleDownload}
            className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-colors border border-border/50"
            title="Download sorted list as JSON"
          >
            {/* Download Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            JSON
          </button>
        )}
      </div>

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
                <span className="text-sm font-medium truncate">
                  Person {item.personId}
                </span>
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
