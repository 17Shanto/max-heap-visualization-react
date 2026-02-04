import React from "react";
import Tree from "react-d3-tree";
import "./custom-tree.css";

import data from "./../../../public/data";
import getDescendingTreeData from "../../utils/utils";

export default function TreeGraph() {
  const tree_data = getDescendingTreeData(data);
  const translate = { x: 400, y: 50 };
  return (
    <div className="flex justify-center">
      <div
        id="treeWrapper"
        style={{ width: "70em", height: "120em", border: "1px solid #ccc" }}
      >
        <Tree
          data={tree_data}
          translate={translate} // This moves the root to the middle
          orientation="vertical"
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
        />
      </div>
    </div>
  );
}
