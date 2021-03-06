// 暴力 O(n*(n/2)*(n/2)) ^= O(n*n*n)


function checkPalindrome (str) {
  let start = 0;
  let end = str.length - 1;
  while (start <= end) {
    if (str[start] !== str[end]) {
      return false
    }
    start++; end--;
  }

  return true
}
// (1).找出所有的子字符串，看是否时回文
function longestPalindrome1 (str) {
  if (str.length <= 1) {
    return str;
  }
  let len = str.length;
  let maxLen = 0;
  let subStr = "";
  let longestStr = "";
  for (let i = 0 ; i < len ; i++) {
    for (let j = i + 1; j < len; j++) {
      subStr = str.substr(i, j - i + 1);
      if (checkPalindrome(subStr) &&  maxLen < j - i + 1) {
        maxLen = j - i +  1;
        longestStr = subStr;
      }
    }
  }
  return longestStr;
}

// 一次for 循环一每个位置的i开始查看是否是字符串
// (2).遍历一次 以每个当前的做中心  O(*) < O(n*(n/2))
let longestPalindrome2 = function(s) {
  let len = s.length
    ,subStr = "";
  for (let i = 0; i < len; i++) {
    // flag 用来标识 是否出现两边和中间一样的情况
    let j = i, k = i,isEqual=true;
    while(j>=0 && k<len) {
      // 左右相等， 且为同一字符时，不溢出
      if (s[j-1] === s[k+1] && j-1>=0) {
        j--;k++;
        if (s[j] !== s[i]) {
          isEqual = false
        }
      }
      // 与左边或右边相等时
      else if (s[j - 1] === s[j] && isEqual) {
        j--;
      } else if (s[k + 1] === s[k] && isEqual) {
        k++;
      }
      // 都不是  结束当前while
      else {
        break;
      }
    }
    if (subStr.length < k - j + 1) {
      // 这里截取的时候始终超出范围
      subStr = s.substring(j,k+1)
      if (subStr.length === len) {
        return subStr;
      }
    }
  }
  return subStr;
};

// (3). 在字符中添加符号
function longestPalindrome3 (str) {
  if (str.length <= 1) {
    return str;
  }
  let len = str.length;
  let maxStr = "";
  let start = 0;
  let end = 0;
  str = str.split("").join("@");
  console.log(str);

  for(let i = 0 ; i < len ; i++ ) {
    start = i;
    end = i;
    while(start - 1 >= 0 && end + 1 < len && str[start - 1] === str[end + 1]) {
      start -- ;
      end ++;
    }
    if(end - start +1 > maxStr.length) {
      maxStr = str.substring(start, end +1);
    }
  }

  return maxStr;
}

console.log(longestPalindrome3("asqqss"))
