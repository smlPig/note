[TOC]
1. children 所有元素子节点

2. childNodes  获取所有类型子节点
    nodeType=3-------------->文本节点
    nodeType=1------------->元素节点
    childNodes 属性返回节点的子节点集合，以 NodeList 对象  
https://www.cnblogs.com/Jersen/p/4908943.html

3. firstChild
    let one = document.querySelector("#one");
    let child = one.firstChild;
    let fragment = document.createDocumentFragment();
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child); // 相当于把当前child 移动到 fragment
      child = one.firstChild
    }
    之后one.childNodes.length === 0  true

## parentElement  获取相应的父元素
    parentElement = parentNode

## 常用调用
   var a = document.getElementByIdx_x_x("dom");数
   var b = a.childNodes;//获取a的全部子节点；
   var c = a.parentNode;//获取a的父节点；
   var d = a.nextSibling;//获取a的下一个兄弟节点
   var e = a.previousSibling;//获取a的上一个兄弟节点
   var f = a.firstChild;//获取a的第一个子节点
   var g = a.lastChild;//获取a的最后一个子节点