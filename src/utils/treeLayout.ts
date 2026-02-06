import { HeapNode } from "./utils";

export interface TreePosition extends HeapNode {
  index: number;
  x: number;
  y: number;
}

export const getTreePositions = (heapData: HeapNode[], width = 800): TreePosition[] => {
  if (!heapData.length) return [];

  const positions: TreePosition[] = [];
  const verticalSpacing = 80;
  const initialOffset = width / 4;

  heapData.forEach((node, index) => {
    const depth = Math.floor(Math.log2(index + 1));

    let x: number, y: number;

    if (index === 0) {
      x = width / 2;
      y = 50;
    } else {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentPos = positions[parentIndex];

      const isLeft = index % 2 !== 0;
      const offset = initialOffset / Math.pow(2, depth - 1);

      x = isLeft ? parentPos.x - offset : parentPos.x + offset;
      y = depth * verticalSpacing + 50;
    }

    positions[index] = {
      ...node,
      index,
      x,
      y,
    };
  });

  return positions;
};
