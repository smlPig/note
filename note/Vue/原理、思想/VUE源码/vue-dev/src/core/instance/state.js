/* @flow */

import config from '../config'
import Watcher from '../observer/watcher'
import Dep, { pushTarget, popTarget } from '../observer/dep'
import { isUpdatingChildComponent } from './lifecycle'

import {
  set,
  del,
  observe,
  defineReactive,
  toggleObserving
} from '../observer/index'

import {
  warn,
  bind,
  noop,
  hasOwn,
  hyphenate,
  isReserved,
  handleError,
  nativeWatch,
  validateProp,
  isPlainObject,
  isServerRendering,
  isReservedAttribute
} from '../util/index'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initState (vm: Component) {
  // 这个数组将用来存储所有该组件实例的 watcher 对象。
  vm._watchers = []
  const opts = vm.$options
  // props 早于 data 初始化，这就是可以使用 props 初始化 data 的原因
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    // 不存在则直接调用 observe 函数观测一个空对象：{}
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  // 在火狐浏览器中依然能够通过原型链访问到原生的 Object.prototype.watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

function initProps (vm: Component, propsOptions: Object) {
  // 用来存储来自外界的组件数据的
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  // 根组件实例的 $parent 属性的值是不存在的
  // 如果当前组件实例是根组件的话，那么定义的
  // props 的值也会被定义为响应式数据。
  if (!isRoot) {
    // toggleObserving 函数是一个开关
    // 当你调用 observe 函数去观测一个数据对象时，只有当变量
    // shouldObserve 为真的时候才会进行观测。
    // 防止 在使用 defineReactive 函数定义属性
    //时，
    // 会调用 observe 函数对值继续进行观测
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    // 等价于将 key 添加到 vm.$options._propKeys 属性中
    keys.push(key)
    // 用来校验名字(key)给定的 prop 数据是否符合预期的类型，
    // 并返回相应 prop 的值(或默认值)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    // 无论是生产环境还是非生产环境，行为一致。
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}

function initData (vm: Component) {
  let data = vm.$options.data
  // option.js 里面 vm.$options.data 其实最终被处理成了一个函数
  // 这里判断是因为：beforeCreate 生命周期钩子函数是在 mergeOptions
  // 函数之后 initData 之前被调用的，如果在 beforeCreate 生命周期钩
  // 子函数中修改了 vm.$options.data 的值，那么在 initData 函数中对
  // 于 vm.$options.data 类型的判断就是必要的
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

  // 是不是一个纯对象
  // 防止开发者编写时 在data 函数中返回其他类型数据，如下：
  /**
   *  data () {
        return '我就是不返回对象'
      }
   * */
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    // 在非生产环境下如果发现在 methods 对象上定义了同样的 key，
    // 也就是说 data 数据的 key 与 methods 对象中定义的函数名称相同，
    // 那么会打印一个警告
    // vue 会代理访问 data, props, methods
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    // 如果发现 data 数据字段的 key 已经在 props 中有定义了，那么就会打印警告。
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
      // !isReserved(key)，该条件的意思是判断定义在 data 中的 key 是否是保留键
    } else if (!isReserved(key)) {
      // 实现实例对象的代理访问
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}

export function   getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  // 防止使用 props 数据初始化 data 数据时收集冗余的依赖，
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}

// 用来标识一个观察者对象是计算属性的观察者，
// 计算属性的观察者与非计算属性的观察者的行为是不一样的
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  // 存储计算属性观察者的
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    // 服务端渲染中计算属性的实现本质上和使用 methods 选项差不多。
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    // 检查计算属性的名字是否已经存在于组件实例对象中
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    // 由于 userDef 是函数，这说明该计算属性并没有指定 set 拦截器函数，
    // 所以直接将其设置为空函数 noop
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  //
  /** sharedPropertyDefinition
   * sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: createComputedGetter(key),
      set: userDef.set // 或 noop
    }
   * */
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function computedGetter () {
    // 属性被读取时，computedGetter 函数将会执行，在 computedGetter 函数内部，
    // 首先定义了 watcher 常量，它的值为计算属性 的观察者对象，
    // 紧接着如果该观察者对象存在，则会分别执行观察者对象的 depend 方法和 evaluate 方法。
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        // 方法名已经被用于 prop
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      // 检测方法名字 key 是否已经在组件实例对象 vm 中有了定义，
      // 并且该名字 key 为保留的属性名
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}

function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

// 将纯对象形式的参数规范化一下
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  /**
   * watch: {
        name: 'handleNameChange'
      },
         methods: {
        handleNameChange () {
          console.log('name change')
        }
      }
  */
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}

// nzq_mark
export function stateMixin (Vue: Class<Component>) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  const dataDef = {}
  // $data 属性实际上代理的是 _data 这个实例属性。
  dataDef.get = function () { return this._data }

  const propsDef = {}
  // $props 代理的是 _props 这个实例属性。
  propsDef.get = function () { return this._props }

  // 非开发环境提示：不能修改 $data 和 $props
  // $data 和 $props 是两个只读的属性
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }

  // $data 和 $props，这两个属性的定义分别写在了 dataDef 以及 propsDef 这两个对象里
  // 没有指定 configurable、enumerable、writable 都为false
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  // 给对象，数组动态添加属性
  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    // immediate 选项用来在属性或函数被侦听后立即执行回调，如上代码就是其实现原理，
    // 如果发现 options.immediate 选项为真，那么会执行回调函数
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    // 这个函数的执行会解除当前观察者对属性的观察
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
