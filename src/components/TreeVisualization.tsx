import { useMemo, useState } from "react";
import { HeapItem, calculateTreeLayout } from "@/utils/heapUtils";

interface TreeVisualizationProps {
  heap: HeapItem[];
  highlightedIndices: number[];
  phase: string;
  message: string;
}

const NODE_RADIUS = 28;

const TreeVisualization = ({
  heap,
  highlightedIndices,
  phase,
  message,
}: TreeVisualizationProps) => {
  const width = 900;
  const height = 600;
  const [selectedNode, setSelectedNode] = useState<HeapItem | null>(null);

  const { nodes, edges } = useMemo(
    () => calculateTreeLayout(heap, width, height),
    [heap],
  );

  const getNodeClasses = (index: number) => {
    const isHighlighted = highlightedIndices.includes(index);
    const isSelected = selectedNode?.id === heap[index]?.id;

    if (isHighlighted && (phase === "extracting" || phase === "heapify-down")) {
      return {
        fill: "hsl(var(--node-extracting))",
        textFill: "hsl(var(--node-extracting-foreground))",
        glow: true,
      };
    }
    if (isHighlighted) {
      return {
        fill: "hsl(var(--node-highlight))",
        textFill: "hsl(var(--node-highlight-foreground))",
        glow: true,
      };
    }
    if (isSelected) {
      return {
        fill: "hsl(var(--primary))",
        textFill: "hsl(var(--primary-foreground))",
        glow: false,
        stroke: "hsl(var(--ring))",
      };
    }

    return {
      fill: "hsl(var(--node))",
      textFill: "hsl(var(--node-foreground))",
      glow: false,
    };
  };

  return (
    <div className="flex flex-col h-full relative">
      <h2 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Max-Heap Tree
      </h2>

      <div className="mb-2 px-3 py-2 rounded-lg bg-muted/50 border border-border min-h-[40px] flex items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {message || "Idle — add items and press Play to start"}
        </p>
        {selectedNode && (
          <button
            onClick={() => setSelectedNode(null)}
            className="text-[10px] bg-slate-400 px-2 py-1 rounded hover:bg-slate-400/80 transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="flex-1 rounded-xl bg-card border border-border overflow-hidden flex items-center justify-center relative">
        {heap.length === 0 ? (
          <p className="text-muted-foreground text-sm">No items in heap</p>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            onClick={() => setSelectedNode(null)}
          >
            <g>
              {edges.map((edge) => (
                <line
                  key={`edge-${Math.round(edge.parentX)}-${Math.round(edge.parentY)}-${Math.round(edge.childX)}-${Math.round(edge.childY)}`}
                  x1={edge.parentX}
                  y1={edge.parentY}
                  x2={edge.childX}
                  y2={edge.childY}
                  stroke="hsl(var(--edge-color))"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              ))}
            </g>

            <g>
              {nodes.map((node) => {
                const style = getNodeClasses(node.index);
                return (
                  <g
                    key={node.item.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node.item);
                    }}
                  >
                    {style.glow && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={NODE_RADIUS + 6}
                        fill="none"
                        stroke={style.fill}
                        strokeWidth={3}
                        opacity={0.3}
                        className="animate-pulse"
                      />
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_RADIUS}
                      fill={style.fill}
                      stroke={style.stroke || "transparent"}
                      strokeWidth={3}
                      className="transition-all duration-300 group-hover:brightness-110"
                    />

                    <text
                      x={node.x}
                      y={node.y - 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={style.textFill}
                      fontSize={14}
                      fontWeight={700}
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none"
                    >
                      {node.item.weight}
                    </text>

                    <text
                      x={node.x}
                      y={node.y + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={style.textFill}
                      fontSize={8}
                      fontFamily="'Space Grotesk', sans-serif"
                      opacity={0.85}
                      className="pointer-events-none"
                    >
                      P{node.item.personId}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {selectedNode && (
          <div className="absolute top-4 right-4 w-48 p-4 bg-popover/90 backdrop-blur-sm border border-border rounded-lg shadow-xl animate-in fade-in slide-in-from-right-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">
              Node Info
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-mono">
                <span className="opacity-50">Weight:</span>{" "}
                {selectedNode.weight}
              </p>
              <p className="text-sm font-mono">
                <span className="opacity-50">Person:</span> P
                {selectedNode.personId}
              </p>
              <p className="text-sm font-mono">
                <span className="opacity-50">Index:</span>{" "}
                {heap.findIndex((h) => h.id === selectedNode.id)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeVisualization;
