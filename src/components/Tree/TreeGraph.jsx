import React, { useState } from "react";
import Tree from "react-d3-tree";
import "./custom-tree.css";
import { TfiZoomIn } from "react-icons/tfi";
import { TfiZoomOut } from "react-icons/tfi";
import getDescendingTreeData from "../../utils/utils";
import { useGraphData } from "../../context/DataContext";

export default function TreeGraph() {
  const [zoom, setZoom] = useState(0.4);
  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      if (prevZoom < 1.1) {
        return parseFloat((prevZoom + 0.1).toFixed(1));
      }
      return prevZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      if (prevZoom > 0.1) {
        return parseFloat((prevZoom - 0.1).toFixed(1));
      }
      return prevZoom;
    });
  };
  const { graphData } = useGraphData();
  console.log(graphData);
  const tree_data = getDescendingTreeData(graphData);
  const translate = { x: 600, y: 50 };
  return (
    <div className="flex justify-center">
      <div
        id="treeWrapper"
        className="relative"
        style={{ width: "70em", height: "120em", border: "1px solid #ccc" }}
      >
        <div className="">
          <button
            onClick={handleZoomIn}
            className="btn btn-sm  btn-soft btn-info absolute top-4 right-16 z-10"
          >
            <span className="text-xl">
              <TfiZoomIn />
            </span>
          </button>
          <button
            onClick={handleZoomOut}
            className="btn btn-sm btn-soft btn-secondary absolute top-4 right-4 z-10"
          >
            <span className="text-xl">
              <TfiZoomOut />
            </span>
          </button>
        </div>
        <Tree
          data={tree_data}
          translate={translate} // This moves the root to the middle
          orientation="vertical"
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          zoom={zoom}
          separation={{ siblings: 1, nonSiblings: 1.5 }}
        />
      </div>
    </div>
  );
}
