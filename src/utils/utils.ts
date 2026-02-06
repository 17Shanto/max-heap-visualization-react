export interface HeapNode {
  personId: number;
  weight: number;
}

export const getParentIndex = (i: number): number => Math.floor((i - 1) / 2);
export const getLeftChildIndex = (i: number): number => 2 * i + 1;
export const getRightChildIndex = (i: number): number => 2 * i + 2;

export const stepHeapifyUp = (heap: HeapNode[], currentIndex: number) => {
  if (currentIndex === 0)
    return { newHeap: heap, nextIndex: null, swapped: false, targetIndex: null };

  const parentIndex = getParentIndex(currentIndex);
  const newHeap = [...heap];

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

export const stepHeapifyDown = (heap: HeapNode[], currentIndex: number) => {
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
