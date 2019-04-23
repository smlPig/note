/**
 * @Author nzq
 * @Date 2019/4/18
 * @Description: 防抖
 * @Param:
 * @Return:
 */
function debounce(fun, delay) {
  return function (...args) {
    let that = this;
    clearTimeout(fun.timer)
    fun.timer = setTimeout(function () {
      fun.call(that, args)
    }, delay)
  }
}
/*
function debounce(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function () {
    method.call(context);
  }, 100)
}
*/




/**
 * @Author nzq
 * @Date 2019/4/18
 * @Description: 节流
 * @Param:
 * @Return:
 */

function throttle(fun, delay) {
  let last, now;
  return function (...args) {
    let that = this;
    now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(fun.timer)
      fun.timer = setTimeout(function () {
        last = now
        fun.apply(that, args)
      }, delay)
    }else {
      last = now
      fun.apply(that,args)
    }
  }
}

