export const getTreePositions = (heapData, width = 800) => {
  if (!heapData.length) return [];

  const positions = [];
  const verticalSpacing = 80;
  const initialOffset = width / 4; // Distance from root to first children

  heapData.forEach((node, index) => {
    // 1. Calculate Depth (Root is 0, children of root are 1, etc.)
    const depth = Math.floor(Math.log2(index + 1));

    let x, y;

    if (index === 0) {
      // Root Position
      x = width / 2;
      y = 50;
    } else {
      // Child Position: Calculate relative to Parent
      const parentIndex = Math.floor((index - 1) / 2);
      const parentPos = positions[parentIndex]; // We can access this because parents are always processed first

      // Is this a left child? (Odd indices are left, Even are right)
      const isLeft = index % 2 !== 0;

      // Calculate Offset:
      // Level 1 offset = initialOffset (e.g., 200px)
      // Level 2 offset = initialOffset / 2 (e.g., 100px)
      // Level 3 offset = initialOffset / 4 (e.g., 50px)
      // Math.pow(2, depth - 1) gives us 1, 2, 4, 8...
      const offset = initialOffset / Math.pow(2, depth - 1);

      x = isLeft ? parentPos.x - offset : parentPos.x + offset;
      y = depth * verticalSpacing + 50;
    }

    positions[index] = {
      ...node, // Contains { personId, weight }
      index, // Useful for tracking active highlights
      x,
      y,
    };
  });

  return positions;
};
