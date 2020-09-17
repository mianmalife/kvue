function defineReactive(obj, key, val) {
  observe(val)
  let dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get: ${key}`)
      Dep.target && dep.addDep(Dep.target);
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log(`set: ${key}:${newVal}`)
        observe(newVal)
        val = newVal
        dep.notify()
      }
    }
  })
}
function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return
  }
  new Observe(obj)
}

function Proxy(vm, sourceKey) {
  Object.keys(vm[sourceKey]).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourceKey][key]
      },
      set(newVal) {
        vm[sourceKey][key] = newVal
      }
    })
  })
}

class KVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    observe(this.$data)
    Proxy(this, '$data')
    new Compile(this.$options.el, this)
  }
}
class Observe {
  constructor(value) {
    this.value = value
    if (typeof value === 'object') {
      this.walk(value)
    }
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}
// 观察者：保存更新函数，值发生变化调用更新函数
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    Dep.target = this; // Dep.target静态属性上设置为当前Wather实例
    this.vm[this.key]; //读取触发了getter
    Dep.target = null; //收集完置空
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}

// Dep: 依赖，管理某个key相关的Watcher实例
class Dep {
  constructor() {
    this.deps = []
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}