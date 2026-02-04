import React from "react";
import Tree from "react-d3-tree";
import "./custom-tree.css";

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const data = {
  name: "CEO",
  children: [
    {
      name: "Manager",
      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Foreman",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
        {
          name: "Foreman",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
      ],
    },
  ],
};

export default function TreeGraph() {
  const translate = { x: 400, y: 50 };
  return (
    <div className="flex justify-center">
      <div
        id="treeWrapper"
        style={{ width: "70em", height: "120em", border: "1px solid #ccc" }}
      >
        <Tree
          data={data}
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
