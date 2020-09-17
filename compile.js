// 编译器
// 递归遍历dom树
// 判断节点类型，如果是文本，判断是否是插值绑定
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      // 执行编译
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      //是元素节点
      if (this.isElement(node)) {
        this.compileElement(node);
        //插值文本
      } else if (this.isInter(node)) {
        //编译插值文本
        this.compileText(node)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    this.update(node, RegExp.$1, 'text');
  }
  update(node, exp, dir) {
    // 初始化
    // 指令对应函数xxUpdater
    let fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);

    // 更新处理， 封装一个函数，可以更新对应的dom元素
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
  }
  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      let attrName = attr.name;
      let exp = attr.value;
      if (this.isDirective(attrName)) {
        let dir = attrName.substring(2)
        this[dir] && this[dir](node, exp);
      }
    })
  }
  isDirective(attrName) {
    return attrName.indexOf('k-') === 0;
  }
  // k-text
  text(node, exp) {
    this.update(node, exp, 'text')
  }
  textUpdater(node, value) {
    node.textContent = value;
  }
  // k-html
  html(node, exp) {
    this.update(node, exp, 'html');
  }
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
}