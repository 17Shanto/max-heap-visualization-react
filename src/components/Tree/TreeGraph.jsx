import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <g id="edges-layer">
          <AnimatePresence>
            {nodes.map((node) => {
              if (node.index === 0) return null;
              const parent = nodes[getParentIndex(node.index)];
              if (!parent) return null;
              if (
                !parent ||
                typeof parent.x !== "number" ||
                typeof parent.y !== "number" ||
                typeof node.x !== "number" ||
                typeof node.y !== "number"
              ) {
                return null;
              }
              return (
                <motion.line
                  key={`edge-${parent.personId}-${node.personId}`}
                  initial={{ opacity: 0 }}
                  animate={{
                    x1: parent.x ?? 0,
                    y1: parent.y ?? 0,
                    x2: node.x ?? 0,
                    y2: node.y ?? 0,
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </AnimatePresence>
        </g>

        {/* NODES */}
        <g id="nodes-layer">
          <AnimatePresence>
            {nodes.map((node) => {
              let bgColor = "#ffffff";
              let borderColor = "#94a3b8";
              let scale = 1;
              let zIndex = 0;

              if (node.index === highlightIndices.current) {
                bgColor = "#fca5a5";
                borderColor = "#ef4444";
                scale = 1.2;
                zIndex = 10;
              } else if (node.index === highlightIndices.target) {
                bgColor = "#86efac";
                borderColor = "#22c55e";
                scale = 1.2;
                zIndex = 10;
              }

              return (
                <motion.g
                  key={node.personId}
                  initial={{ scale: 0, opacity: 0, x: node.x, y: node.y }}
                  animate={{
                    x: node.x ?? 0,
                    y: node.y ?? 0,
                    scale: 1,
                    opacity: 1,
                    zIndex,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <circle
                    r={NODE_RADIUS}
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth="3"
                  />
                  <text
                    dy="5"
                    textAnchor="middle"
                    className="text-xs font-bold fill-slate-700 pointer-events-none select-none"
                    style={{ fontSize: "12px" }}
                  >
                    W:{node.weight}
                  </text>
                  <text
                    dy="32"
                    textAnchor="middle"
                    className="fill-slate-400 text-[9px] pointer-events-none select-none"
                  >
                    ID:{node.personId}
                  </text>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>

        {/* Empty state */}
        <g id="ui-layer">
          <motion.text
            x="400"
            y="300"
            textAnchor="middle"
            fill="#cbd5e1"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: nodes.length === 0 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            Tree is Empty
          </motion.text>
        </g>
      </svg>
    </div>
  );
}
