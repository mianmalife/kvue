function defineReactive(obj, key, val) {
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log(`get: ${key}`)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log(`set: ${key}:${newVal}`)
                observe(newVal)
                val = newVal
            }
        }
    })
}
function observe(obj) {
    if(typeof obj !== 'object' || obj == null) {
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
    }
}
class Observe {
    constructor(value) {
        this.value = value
        if(typeof value === 'object') {
            this.walk(value)
        }
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}