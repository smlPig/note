/**
 * @Author nzq
 * @Date 2019/5/23
 * [最小的K个数](https://www.nowcoder.com/practice/6a296eb82cf844ca8539b57c23e6e9bf?tpId=13&tqId=11182&rp=2&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)
 * @Description: 输入n个整数，找出其中最小的K个数。例如输入4,5,1,6,2,7,3,8这8个数字，则最小的4个数字是1,2,3,4,。
 * @Param:
 * @Return:
 */

// 思路一：先排序，再找最小的k个数
function _GetLeastNumbers_Solution(input, k)
{
  // write code here
  if(k > input.length || k <= 0) {
    return [];
  }
  input.sort((pre, next) => pre - next);
  return input.slice(0, k);
}

// 思路二：小顶堆
function __GetLeastNumbers_Solution(input, k)
{
  // write code here
  let result = [],
    len = input.length;

  if (k === len) {
    result = input.sort();
  } else if (k < len && k > 0) {
    for (let i = Math.floor(len / 2); i >= 0; i--) {
      minHeapfiy(input, i);
    }
    for (let i = 0; i < k; i++) {
      [input[0], input[len-1]] = [input[len - 1], input[0]];
      len --;
      result.push(input.pop());
      minHeapfiy(input, 0);
    }
  }
  return result;
}

function minHeapfiy(arr, idx) {
  let left = idx * 2 + 1,
    right = idx * 2 + 2,
    len = arr.length,
    minIdx = idx;
  if (left < len && arr[left] < arr[minIdx]) {
    minIdx = left;
  }
  if (right < len && arr[right] < arr[minIdx]) {
    minIdx = right;
  }
  if (minIdx !== idx) {
    [arr[minIdx], arr[idx]] = [arr[idx], arr[minIdx]];
    if (minIdx * 2 + 1 <= len) {
      minHeapfiy(arr, minIdx);
    }
  }
}

// 思路三：partition 算法（快速排序中有使用）
// O(n)
function GetLeastNumbers_Solution(input, k)
{
    // write code here
  let left = 0,
    len = input.length,
    right = len-1,
    result = [],
    pivotIdx;

  if (k === len) {
    result = input.sort((pre, next) => pre - next);
  } else if(k>0 &&  k<right) {
    k--;
    while(left < right) {
      pivotIdx = partition(input, left, right);
      if(pivotIdx === k) {
        break;
      }
      if (pivotIdx > k) right = pivotIdx - 1;
      if (pivotIdx < k) left = pivotIdx + 1;
    }
    result = input.slice(0, k);
  }

  return result.sort((pre, cur) => pre - cur);
}

function partition(arr, left, right) {
  let pivot = arr[left];
  right++;
  while(left < right) {
    while(left < right && arr[--right] >= pivot);
    arr[left] = arr[right];
    while(left < right && arr[++left] <= pivot);
    arr[right] = arr[left];
  }
  arr[left] = pivot;
  return left;
}

// 思路4：利用一个 length === k 的数组，记录最小的数
// 时间复杂度O(k * n)
console.log(GetLeastNumbers_Solution([2,4,7,1,100,6,9], 4))
