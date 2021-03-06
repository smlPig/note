/**
 * @Author nzq
 * @Date 2019/5/28
 * @Description:
 * @Param:
 * @Return:
 */
const type = Object.prototype.toString;

function getType(obj) {
  const map = {
    '[object Boolean]'         : 'boolean',
    '[object Number]'          : 'number',
    '[object String]'          : 'string',
    '[object Null]'            : 'null',
    '[object Undefined]'       : 'undefined',
    '[object Symbol]'          : 'symbol',
    '[object Object]'          : 'object',
    '[object Array]'           : 'array',
    '[object Function]'        : 'function',
    '[object Date]'            : 'date',
    '[object RegExp]'          : 'regExp',
    '[object HTMLDivElement]'  : 'dom',
  };

  return map[type.call(obj)];
}

/**
 * @Author nzq
 * @Date 2019/5/28
 * @Description: 递归
 *        注意 visitedQueue.push(target); createQueue.push(res); 的时机
 * @Param:
 * @Return:
 */
function deepClone(obj) {
  // visitedQueue 和 createQueue 的值一定要相互对应
  let visitedQueue = [],
    createQueue = [],
    visitedIdx = 0;

  return (function _clone (target) {
    let res = null,
    type = getType(target);

    visitedIdx = visitedQueue.indexOf(target);

    // 访问过
    if ( visitedIdx !== -1) {
      res = createQueue[visitedIdx]; // 获取对应的 createQueue 中的值
    }
    // 没访问过
    else {
      switch(type) {
        case 'object': {
          res = {};
          visitedQueue.push(target);
          createQueue.push(res);

          // 遍历
          for (let key in target) {
           res[key] = _clone(target[key]);
          }
          break;
        }
        case 'array': {
          res = [];
          visitedQueue.push(target);
          createQueue.push(res);

          // 遍历
          for (let idx in target) {
            res[idx] = _clone(target[key]);
          }
          break;
        }
        case 'dom': {
          res = target.cloneNode(true);
          break;
        }
        default : {
          res = target;
        }
      }
    }
    return res;
  })(obj)
}

let  nzq = {
  name: 'nzq',
  lover: null,
}
let wx = {
  name: 'wx',
  lover: nzq,
}
nzq.lover = wx;

let cloneObj = deepClone(nzq);
let cloneObj1 = JSON.parse(JSON.stringify(nzq));
