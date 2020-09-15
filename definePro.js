function defineReactive(obj, key, val) {
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log(`get: ${key}:${val}`)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log(`set: ${key}:${newVal}`)
                observe(newVal)
                val = newVal
                // update()
            }
        }
    })
}
function observe(obj) {
    if(typeof obj !== 'object' || obj == null) {
        return
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}
function set(obj, key, val) {
    defineReactive(obj, key, val)
}
let obj = { a: 2, b: 3, c: { d: 4 }}
observe(obj)
obj.a
obj.a = 5
obj.c = { d: 4 }
obj.c.d = 9
set(obj, 'x', 'xxx')
obj.x