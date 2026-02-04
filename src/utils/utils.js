function heapify(arr, n, i) {
  let extreme = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && arr[left].weight < arr[extreme].weight) {
    extreme = left;
  }

  if (right < n && arr[right].weight < arr[extreme].weight) {
    extreme = right;
  }

  if (extreme !== i) {
    [arr[i], arr[extreme]] = [arr[extreme], arr[i]];
    heapify(arr, n, extreme);
  }
}

function performDescendingHeapSort(data) {
  let arr = [...data];
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function convertToTreeFormat(arr, index = 0) {
  if (index >= arr.length) return null;

  const node = {
    name: `${arr[index].weight}`,
    attributes: {
      personId: arr[index].personId,
      weight: arr[index].weight,
    },
    children: [],
  };

  const leftIndex = 2 * index + 1;
  const rightIndex = 2 * index + 2;

  const leftChild = convertToTreeFormat(arr, leftIndex);
  const rightChild = convertToTreeFormat(arr, rightIndex);

  if (leftChild) node.children.push(leftChild);
  if (rightChild) node.children.push(rightChild);

  return node;
}

function getDescendingTreeData(data) {
  const sortedArray = performDescendingHeapSort(data);
  const treeRoot = convertToTreeFormat(sortedArray);
  return [treeRoot];
}

export default getDescendingTreeData;
