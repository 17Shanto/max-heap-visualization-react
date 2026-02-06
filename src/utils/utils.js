// src/utils/utils.js

export const getParentIndex = (i) => Math.floor((i - 1) / 2);
export const getLeftChildIndex = (i) => 2 * i + 1;
export const getRightChildIndex = (i) => 2 * i + 2;

// Converts a flat array to the hierarchical object structure required by react-d3-tree
export const arrayToTreeData = (data, index = 0, highlightIndices = {}) => {
  if (index >= data.length || !data[index]) return null;

  const currentNode = data[index];

  // Determine color based on whether this node is currently being compared/swapped
  let nodeColor = "#ffffff"; // Default white
  let strokeColor = "#3b82f6"; // Default blue

  if (index === highlightIndices.current) {
    nodeColor = "#fca5a5"; // Red (Active item)
  } else if (index === highlightIndices.target) {
    nodeColor = "#86efac"; // Green (Target/Swap partner)
  }

  return {
    name: `${currentNode.weight}`,
    attributes: {
      id: currentNode.personId,
      weight: currentNode.weight,
      nodeColor,
      strokeColor,
    },
    children: [
      arrayToTreeData(data, getLeftChildIndex(index), highlightIndices),
      arrayToTreeData(data, getRightChildIndex(index), highlightIndices),
    ].filter((child) => child !== null), // Remove null children for cleaner tree
  };
};

/**
 * LOGIC: Single Step of Heapify Up
 * Returns: { newHeap, nextIndex, swapped (bool) }
 */
export const stepHeapifyUp = (heap, currentIndex) => {
  if (currentIndex === 0)
    return { newHeap: heap, nextIndex: null, swapped: false };

  const parentIndex = getParentIndex(currentIndex);
  const newHeap = [...heap];

  // MAX HEAP logic: If Child > Parent, Swap
  if (newHeap[currentIndex].weight > newHeap[parentIndex].weight) {
    [newHeap[currentIndex], newHeap[parentIndex]] = [
      newHeap[parentIndex],
      newHeap[currentIndex],
    ];
    return {
      newHeap,
      nextIndex: parentIndex,
      swapped: true,
      targetIndex: parentIndex,
    };
  }

  return { newHeap, nextIndex: null, swapped: false, targetIndex: parentIndex };
};

/**
 * LOGIC: Single Step of Heapify Down
 * Returns: { newHeap, nextIndex, swapped (bool) }
 */
export const stepHeapifyDown = (heap, currentIndex) => {
  const leftChild = getLeftChildIndex(currentIndex);
  const rightChild = getRightChildIndex(currentIndex);
  let largest = currentIndex;
  const newHeap = [...heap];

  if (
    leftChild < newHeap.length &&
    newHeap[leftChild].weight > newHeap[largest].weight
  ) {
    largest = leftChild;
  }

  if (
    rightChild < newHeap.length &&
    newHeap[rightChild].weight > newHeap[largest].weight
  ) {
    largest = rightChild;
  }

  if (largest !== currentIndex) {
    [newHeap[currentIndex], newHeap[largest]] = [
      newHeap[largest],
      newHeap[currentIndex],
    ];
    return { newHeap, nextIndex: largest, swapped: true, targetIndex: largest };
  }

  return { newHeap, nextIndex: null, swapped: false, targetIndex: null };
};
