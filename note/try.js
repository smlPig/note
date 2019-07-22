/*
题目要求：
数字以01234567891011121314...的格式排列。在这个序列中，
第5位（从0开始计）是5，第13位是1，第19位是4。求任意第n为对应的数字。
*/
function getDigitIndex(index) {
  if (index < 0) {
    return -1;
  }
  if (index === 0) {
    return 0;
  }

  let place = 1; // 1 表示个位，2 表示 十位...
  let amount = 0;
  while (true) {
    amount = getAmountOfPlace(place);
    if (index < amount) {
      return getDigitAtIndex(index, place);
    }
    index -= amount;
    place++;
  }
}

/**
 * place 位数的数字组成的字符串长度
 * 10, 90, 900, ...
 */
function getAmountOfPlace(place) {
  if (place === 1)
    return 10;
  return Math.pow(10, place - 1) * 9 * place;
}

/**
 * place 位数的起始数字
 * 0, 10, 100, ...
 */
function getBeginNumberOfPlace(place) {
  if (place === 1)
    return 0;
  return Math.pow(10, place - 1);
}

/**
 * 在 place 位数组成的字符串中，第 index 个数
 */
// 10 11
function getDigitAtIndex(index, place) {
  let beginNumber = getBeginNumberOfPlace(place);
  let shiftNumber = Math.ceil(index / place);
  let number = (beginNumber + shiftNumber-1) + "";
  let count = index % place;
  console.log(beginNumber, shiftNumber, number, count, index)
  return count === 0 ? number[place-1] : number[count-1];
}

{
  // 0123456789 101112131415
  //          10 11

}

console.log(getDigitIndex(196));
