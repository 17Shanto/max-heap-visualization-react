import React, { useMemo } from "react";
import { useGraphData } from "../../context/DataContext";
import { getTreePositions } from "../../utils/treeLayout";
import { getParentIndex } from "../../utils/utils";

const NODE_RADIUS = 20;

export default function TreeGraph() {
  const { heapData, highlightIndices } = useGraphData();

  const nodes = useMemo(() => {
    return getTreePositions(heapData, 800);
  }, [heapData]);

  return (
    <div className="flex justify-center bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden p-4">
      <svg
        width="100%"
        height="600px"
        viewBox="0 0 800 600"
        className="w-full h-full"
        style={{ maxWidth: "800px" }}
      >
        {/* EDGES */}
        <g id="edges-layer">
          {nodes.map((node) => {
            if (node.index === 0) return null;
            const parent = nodes[getParentIndex(node.index)];
            if (!parent) return null;

            return (
              <line
                key={`edge-${node.index}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke="#cbd5e1"
                strokeWidth="2"
                style={{ transition: "all 0.3s ease" }}
              />
            );
          })}
        </g>

        {/* NODES */}
        <g id="nodes-layer">
          {nodes.map((node) => {
            let bgColor = "#ffffff";
            let borderColor = "#94a3b8";

            if (node.index === highlightIndices.current) {
              bgColor = "#fca5a5";
              borderColor = "#ef4444";
            } else if (node.index === highlightIndices.target) {
              bgColor = "#86efac";
              borderColor = "#22c55e";
            }

            return (
              <g
                key={`node-${node.personId}`}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <circle
                  r={NODE_RADIUS}
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth="3"
                  style={{ transition: "fill 0.2s, stroke 0.2s" }}
                />
                <text
                  dy="5"
                  textAnchor="middle"
                  style={{ fontSize: "12px", fill: "#334155", fontWeight: "bold", pointerEvents: "none", userSelect: "none" }}
                >
                  {node.weight}
                </text>
                <text
                  dy="32"
                  textAnchor="middle"
                  style={{ fontSize: "9px", fill: "#94a3b8", pointerEvents: "none", userSelect: "none" }}
                >
                  ID:{node.personId}
                </text>
              </g>
            );
          })}
        </g>

        <g id="ui-layer">
          {nodes.length === 0 && (
            <text
              x="400"
              y="300"
              textAnchor="middle"
              fill="#cbd5e1"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                pointerEvents: "none",
              }}
            >
              Tree is Empty
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
