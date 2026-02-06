// All heap sort logic lives here

export interface HeapItem {
  id: string;
  personId: number;
  weight: number;
}

export interface HeapState {
  heap: HeapItem[];
  inputStack: HeapItem[];
  sortedList: HeapItem[];
  highlightedIndices: number[];
  phase: 'idle' | 'inserting' | 'heapify-up' | 'extracting' | 'heapify-down' | 'done';
  message: string;
}

export interface HeapStep {
  heap: HeapItem[];
  inputStack: HeapItem[];
  sortedList: HeapItem[];
  highlightedIndices: number[];
  phase: HeapState['phase'];
  message: string;
}

// Get parent index
export function parentIndex(i: number): number {
  return Math.floor((i - 1) / 2);
}

// Get left child index
export function leftChildIndex(i: number): number {
  return 2 * i + 1;
}

// Get right child index
export function rightChildIndex(i: number): number {
  return 2 * i + 2;
}

// Generate all steps for inserting items from input stack into a max-heap
// This builds a max-heap (largest at root) for descending order extraction
export function generateInsertionSteps(
  currentHeap: HeapItem[],
  currentInputStack: HeapItem[],
  currentSortedList: HeapItem[]
): HeapStep[] {
  const steps: HeapStep[] = [];
  const heap = [...currentHeap];
  const inputStack = [...currentInputStack];
  const sortedList = [...currentSortedList];

  while (inputStack.length > 0) {
    // Take item from top of input stack
    const item = inputStack.shift()!;

    // Step: Show item being inserted
    heap.push(item);
    const insertedIndex = heap.length - 1;
    steps.push({
      heap: [...heap],
      inputStack: [...inputStack],
      sortedList: [...sortedList],
      highlightedIndices: [insertedIndex],
      phase: 'inserting',
      message: `Inserting Person ${item.personId} (weight: ${item.weight}) into heap at position ${insertedIndex}`,
    });

    // Heapify up - max heap (larger values bubble up)
    let currentIdx = insertedIndex;
    while (currentIdx > 0) {
      const pIdx = parentIndex(currentIdx);
      if (heap[currentIdx].weight > heap[pIdx].weight) {
        // Highlight the two being compared
        steps.push({
          heap: [...heap],
          inputStack: [...inputStack],
          sortedList: [...sortedList],
          highlightedIndices: [currentIdx, pIdx],
          phase: 'heapify-up',
          message: `Comparing Person ${heap[currentIdx].personId} (${heap[currentIdx].weight}) with parent Person ${heap[pIdx].personId} (${heap[pIdx].weight}) — swapping!`,
        });

        // Swap
        [heap[currentIdx], heap[pIdx]] = [heap[pIdx], heap[currentIdx]];
        currentIdx = pIdx;

        steps.push({
          heap: [...heap],
          inputStack: [...inputStack],
          sortedList: [...sortedList],
          highlightedIndices: [currentIdx],
          phase: 'heapify-up',
          message: `Swapped! Person ${heap[currentIdx].personId} moved to position ${currentIdx}`,
        });
      } else {
        steps.push({
          heap: [...heap],
          inputStack: [...inputStack],
          sortedList: [...sortedList],
          highlightedIndices: [currentIdx],
          phase: 'heapify-up',
          message: `Person ${heap[currentIdx].personId} (${heap[currentIdx].weight}) is in correct position — no swap needed`,
        });
        break;
      }
    }
  }

  return steps;
}

// Generate all steps for extracting items from max-heap (descending order)
export function generateExtractionSteps(
  currentHeap: HeapItem[],
  currentInputStack: HeapItem[],
  currentSortedList: HeapItem[]
): HeapStep[] {
  const steps: HeapStep[] = [];
  const heap = [...currentHeap];
  const inputStack = [...currentInputStack];
  const sortedList = [...currentSortedList];

  while (heap.length > 0) {
    // Step: Highlight root (max element)
    steps.push({
      heap: [...heap],
      inputStack: [...inputStack],
      sortedList: [...sortedList],
      highlightedIndices: [0],
      phase: 'extracting',
      message: `Extracting max element Person ${heap[0].personId} (weight: ${heap[0].weight}) from root`,
    });

    // Extract root
    const extracted = heap[0];

    if (heap.length === 1) {
      heap.splice(0, 1);
      sortedList.push(extracted);
      steps.push({
        heap: [...heap],
        inputStack: [...inputStack],
        sortedList: [...sortedList],
        highlightedIndices: [],
        phase: 'extracting',
        message: `Person ${extracted.personId} added to sorted list. Heap is now empty!`,
      });
      continue;
    }

    // Move last element to root
    const last = heap.pop()!;
    heap[0] = last;
    sortedList.push(extracted);

    steps.push({
      heap: [...heap],
      inputStack: [...inputStack],
      sortedList: [...sortedList],
      highlightedIndices: [0],
      phase: 'heapify-down',
      message: `Moved Person ${last.personId} (${last.weight}) to root. Person ${extracted.personId} added to sorted list.`,
    });

    // Heapify down
    let currentIdx = 0;
    while (true) {
      const left = leftChildIndex(currentIdx);
      const right = rightChildIndex(currentIdx);
      let largest = currentIdx;

      if (left < heap.length && heap[left].weight > heap[largest].weight) {
        largest = left;
      }
      if (right < heap.length && heap[right].weight > heap[largest].weight) {
        largest = right;
      }

      if (largest !== currentIdx) {
        // Highlight comparison
        steps.push({
          heap: [...heap],
          inputStack: [...inputStack],
          sortedList: [...sortedList],
          highlightedIndices: [currentIdx, largest],
          phase: 'heapify-down',
          message: `Comparing Person ${heap[currentIdx].personId} (${heap[currentIdx].weight}) with Person ${heap[largest].personId} (${heap[largest].weight}) — swapping!`,
        });

        // Swap
        [heap[currentIdx], heap[largest]] = [heap[largest], heap[currentIdx]];
        currentIdx = largest;

        steps.push({
          heap: [...heap],
          inputStack: [...inputStack],
          sortedList: [...sortedList],
          highlightedIndices: [currentIdx],
          phase: 'heapify-down',
          message: `Swapped! Person ${heap[currentIdx].personId} moved to position ${currentIdx}`,
        });
      } else {
        steps.push({
          heap: [...heap],
          inputStack: [...inputStack],
          sortedList: [...sortedList],
          highlightedIndices: [currentIdx],
          phase: 'heapify-down',
          message: `Person ${heap[currentIdx].personId} is in correct position — heap property restored`,
        });
        break;
      }
    }
  }

  return steps;
}

// Calculate tree node positions for SVG rendering
export interface TreeNodePosition {
  item: HeapItem;
  index: number;
  x: number;
  y: number;
  level: number;
}

export interface TreeEdge {
  parentX: number;
  parentY: number;
  childX: number;
  childY: number;
}

export function calculateTreeLayout(
  heap: HeapItem[],
  width: number,
  height: number
): { nodes: TreeNodePosition[]; edges: TreeEdge[] } {
  if (heap.length === 0) return { nodes: [], edges: [] };

  const nodes: TreeNodePosition[] = [];
  const edges: TreeEdge[] = [];

  const maxLevel = Math.floor(Math.log2(heap.length)) + 1;
  const levelHeight = Math.min(80, (height - 80) / Math.max(maxLevel, 1));
  const nodeRadius = 28;

  for (let i = 0; i < heap.length; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const levelWidth = width - 60;
    const spacing = levelWidth / (nodesInLevel + 1);
    const x = spacing * (posInLevel + 1) + 30;
    const y = 50 + level * levelHeight;

    nodes.push({ item: heap[i], index: i, x, y, level });

    // Add edge to parent
    if (i > 0) {
      const pIdx = parentIndex(i);
      const parentNode = nodes[pIdx];
      if (parentNode) {
        edges.push({
          parentX: parentNode.x,
          parentY: parentNode.y + nodeRadius,
          childX: x,
          childY: y - nodeRadius,
        });
      }
    }
  }

  return { nodes, edges };
}

// Generate unique ID
let idCounter = 0;
export function generateId(): string {
  return `item-${++idCounter}-${Date.now()}`;
}

// Track next personId
let nextPersonId = 31;

export function getNextPersonId(): number {
  return nextPersonId++;
}

export function resetPersonIdCounter(): void {
  nextPersonId = 31;
}

// Default sample data
export function getDefaultData(): HeapItem[] {
  const data = [
    { personId: 1, weight: 64 },
    { personId: 2, weight: 53 },
    { personId: 3, weight: 85 },
    { personId: 4, weight: 81 },
    { personId: 5, weight: 78 },
    { personId: 6, weight: 67 },
    { personId: 7, weight: 63 },
    { personId: 8, weight: 119 },
    { personId: 9, weight: 61 },
    { personId: 10, weight: 104 },
    { personId: 11, weight: 54 },
    { personId: 12, weight: 53 },
    { personId: 13, weight: 61 },
    { personId: 14, weight: 77 },
    { personId: 15, weight: 79 },
    { personId: 16, weight: 114 },
    { personId: 17, weight: 53 },
    { personId: 18, weight: 75 },
    { personId: 19, weight: 119 },
    { personId: 20, weight: 103 },
    { personId: 21, weight: 78 },
    { personId: 22, weight: 107 },
    { personId: 23, weight: 85 },
    { personId: 24, weight: 50 },
    { personId: 25, weight: 70 },
    { personId: 26, weight: 104 },
    { personId: 27, weight: 93 },
    { personId: 28, weight: 85 },
    { personId: 29, weight: 69 },
    { personId: 30, weight: 77 },
  ];
  nextPersonId = 31;
  return data.map(d => ({ id: generateId(), personId: d.personId, weight: d.weight }));
}
