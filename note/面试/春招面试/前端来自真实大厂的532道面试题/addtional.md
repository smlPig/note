[TOC]
//////////////////////////////VUE开始

4. react和vue的区别，你开发如何选择技术栈
   
https://www.zcfy.cc/article/react-or-vue-which-javascript-ui-library-should-you-be-using-2159.html（国外）
   
https://www.jianshu.com/p/b7cd52868e95?from=groupmessage
    （1） react和vue都是做组件化的，整体的功能都类似，但是他们的设计思路是有很多不同的。使用react和vue，主要是理解他们的设计思路的不同

    （2）数据可变性：
        react整体是函数式的思想，把组件设计成纯组件，状态和逻辑通过参数传入，所以在react中，是单向数据流，推崇结合immutable来实现数据不可变，react在setState之后会重新走渲染的流程，如果shouldComponentUpdate返回的是true，就继续渲染，如果返回了false，就不会重新渲染，PureComponent就是重写了shouldComponentUpdate，然后在里面作了props和state的浅层对比。
         vue的思想是响应式的，也就是基于是数据可变的，通过对每一个属性建立Watcher来监听，当属性变化的时候，响应式的更新对应的虚拟dom。

    （3）通过js来操作一切，还是用各自的处理方式：
        react的思路是all in js，通过js来生成html，所以设计了jsx，还有通过js来操作css，社区的styled-component、jss等，
        vue是把html，css，js组合到一起，用各自的处理方式，vue有单文件组件，可以把html、css、js写到一个文件中，html提供了模板引擎来处理。

    （4）类式的组件写法，还是声明式的写法：
        react是类式的写法，api很少，
        而vue是声明式的写法，通过传入各种options，api和参数都很多。所以react结合typescript更容易一起写，vue稍微复杂。

    （5） react整体的思路就是函数式，所以推崇纯组件，数据不可变，单向数据流，当然需要双向的地方也可以做到，比如结合redux-form，而vue是基于可变数据的，支持双向绑定。vue内置了很多功能，而react做的很少，很多都是由社区来完成的，vue追求的是开发的简单，而react更在乎方式是否正确。

    （6）如果你喜欢用（或希望能够用）模板搭建应用，请使用Vue

    （7）小和快

    （8）模板容易出现难以注意到的运行时错误，同时也不易于测试，重构和分解。React的不可变（immutable）应用状态写起来可能不够Vue简洁，但它在大型应用中仍会大放异彩，因为透明度和可测试性此时变得至关重要



6. vue的理解



7. vue的双向数据绑定的原理



8. vue怎么样实现数组绑定







67. vue和react的区别
    见 题4



68. vue 的原理



170. Vue的生命周期
https://segmentfault.com/a/1190000008010666?utm_source=tag-newest
    beforecreated：el 和 data 并未初始化
    created:完成了 data 数据的初始化，el没有, 在这结束loading，还做一些初始化，实现函数自执行，在这发起后端请求，拿回数据，配合路由钩子做一些事情
    beforeMount：完成了 el 和 data 初始化
    mounted ：完成挂载
    activated::keep-alive组件激活时调用
    beforeDestroy： 你确认删除XX吗？ destroyed ：当前组件已被删除，清空相关内容



178. vue双向绑定原理，vue-loader做了什么
    vue-loader : 解析和转换 .vue 文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template，再分别把它们交给对应的 Loader 去处理。
    Vue Loader 是一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件



192. vue的生命周期
    参考 题170



193. vuex的状态管理的原理是什么
https://www.jianshu.com/p/e54a9a34a773



248. vue react jquery比较，有测试过性能吗
    见 题484



326. jQuery和vue的区别
    见 题484



327. vue的特点
    （1）简洁
        编写风格更加简洁，并且通俗易懂，Vue虽然是一个比较轻量级的框架，简单轻量的同时还非常的人性化，其提供的API也是非常的容易理解，同时也提供了一些很便捷的指令和属性
    （2）轻量
        Vue的成产版本（即min版）源码仅为72.9kb，官网称gzip压缩后只有25.11kb
    （3）快速
    （4）数据驱动
    （5）模块友好
        es6
    （6）组件化
        Vue的组件化功能可谓是它的一大亮点，通过将页面上某一组件的html、CSS、js代码放入一个.vue的文件中进行管理可以大大提高代码的维护性。



328. vue的双向绑定原理



332. vue生命周期



333. vue跨组件通信实现
（1）
    父组件绑定一个 属性， 子组件利用Prop获取，并初始化用来子组件中的一个属性（props: ['postTitle'],）
（2）
    <custom-input
      v-bind:value="searchText"
      v-on:input="searchText = $event"
    ></custom-input>
    或
    <custom-input v-model="searchText"></custom-input>

    Vue.component('custom-input', {
      props: ['value'],
      template: `
        <input
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
        >
      `
    })



334. vue的props和slot的使用，区别
    https://www.jb51.net/article/130336.htm






400. vue diff算法
https://segmentfault.com/a/1190000008782928



401. vue的生命周期
    见 题170



402. vue-router不能解决情况和边界情况？
   
https://cn.vuejs.org/v2/guide/components-edge-cases.html

//////////////////////////////VUE结束



//////////////////////////////webpack开始

16. webpack工程构建工具怎么样用



105. webpack的原理
    webpack只是一个打包模块的机制，只是把依赖的模块转化成可以代表这些包的静态文件。
    IIFE（Immediately-invoked function expression）立即执行函数


//////////////////////////////webpack结束


