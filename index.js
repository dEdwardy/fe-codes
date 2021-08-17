// 1.Object.create   创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
//                   会将参数对象作为一个新创建的空对象的原型, 并返回这个空对象
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

// 2.instanceOf  判断构造函数的 prototype 属性是否出现在  对象的原型链中的任何位置
// 实现步骤：

// 首先获取类型的原型
// 然后获得对象的原型
// 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null
function myInstance(left,right) {
  let proto = Object.getPrototypeOf(left)   //获取对象的原型
  let prototype = right.prototype           //获取构造函数的prototype对象

    //判断构造函数的prototype 是否在对象的原型链上
  while(true) {
    if(!proto)return false
    if(proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

// 3.手写new
// 1. 创建一个空的简单JavaScript对象（即{}）；
// 2. 为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象 ；
// 3. 将步骤1新创建的对象作为this的上下文 ；
// 4. 如果该函数没有返回对象，则返回this。

function _new(fn, ...args) {
  // 基于fn的原型创建一个新的对象
  const emptyObj = Object.create(fn.prototype);

// 添加属性到新创建的emptyObj上, 并获取fn函数执行的结果.
  const newObj = fn.apply(emptyObj, args);

  // 如果执行结果有返回值并且是一个对象, 返回执行的结果, 否则, 返回新创建的对象
  return newObj instanceof Object ? newObj : emptyObj;
}
// function objectFactory() {
//   let newObject = null
//   let constructor = Array.prototype.shift.call(arguments)
//   console.log(constructor,arguments)
//   let result = null
//   // 判断参数是否是一个函数
//   if (typeof constructor !== "function") {
//     console.error("type error")
//     return
//   }
//   // 新建一个空对象，对象的原型为构造函数的 prototype 对象
//   newObject = Object.create(constructor.prototype)
//   // 将 this 指向新建对象，并执行函数
//   result = constructor.apply(newObject, arguments)
//   // 判断返回对象
//   let flag = result && (typeof result === "object" || typeof result === "function")
//   // 判断返回结果
//   return result instanceOF Object ? result : newObject
// }
// 使用方法
// objectFactory(构造函数, 初始化参数)

// 4.手写promise   见promsie.js

// 5.debounce && throttle

function debounce(fn, wait = 500) {
  let timer = null;
  return function () {
    let context = this,
      args = arguments;

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
function throttle(fn, delay = 1000) {
  let curTime = Date.now();

  return function () {
    let context = this,
      args = arguments,
      nowTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - curTime >= delay) {
      curTime = Date.now();
      return fn.apply(context, args);
    }
  };
}