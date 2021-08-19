// 一  js 基础
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
function myInstance(left, right) {
  let proto = Object.getPrototypeOf(left) //获取对象的原型
  let prototype = right.prototype //获取构造函数的prototype对象

  //判断构造函数的prototype 是否在对象的原型链上
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
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
  const emptyObj = Object.create(fn.prototype)

  // 添加属性到新创建的emptyObj上, 并获取fn函数执行的结果.
  const newObj = fn.apply(emptyObj, args)

  // 如果执行结果有返回值并且是一个对象, 返回执行的结果, 否则, 返回新创建的对象
  return newObj instanceof Object ? newObj : emptyObj
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

// 4.手写promise
// 4.1 promise A+ 见promsie.js
// 4.2 prmomise. all /race

// 4.1 Promise.all
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(promises)) {
      throw new TypeError(`argument must be a array`)
    }
    let resolvedCounter = 0
    let promiseNum = promises.length
    let resolvedResult = []
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          resolvedCounter++
          resolvedResult[i] = value
          if (resolvedCounter == promiseNum) {
            return resolve(resolvedResult)
          }
        },
        (error) => {
          return reject(error)
        }
      )
    }
  })
}

// 4.2 Promise.race
// 该方法的参数是 Promise 实例数组, 然后其 then 注册的回调方法是数组中的某一个 Promise 的状态变为 fulfilled 的时候就执行. 因为 Promise 的状态只能改变一次, 那么我们只需要把 Promise.race 中产生的 Promise 对象的 resolve 方法, 注入到数组中的每一个 Promise 实例中的回调函数中即可.
Promise.race = function (args) {
  return new Promise((resolve, reject) => {
    for (let i = 0, len = args.length; i < len; i++) {
      args[i].then(resolve, reject)
    }
  })
}
// 5.debounce && throttle

function debounce(fn, wait = 500) {
  let timer = null
  return function () {
    let context = this,
      args = arguments

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
function throttle(fn, delay = 1000) {
  let curTime = Date.now()

  return function () {
    let context = this,
      args = arguments,
      nowTime = Date.now()

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - curTime >= delay) {
      curTime = Date.now()
      return fn.apply(context, args)
    }
  }
}

// 6.判断类型函数
let getType = val => Object.prototype.toString.call(val).slice(8,-1).toLowerCase()

// 7. 手写call
// call函数实现
// 1.判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
// 2.判断传入上下文对象是否存在，如果不存在，则设置为 window 。
// 3.处理传入的参数，截取第一个参数后的所有参数。
// 4.将函数作为上下文对象的一个属性。
// 5.使用上下文对象来调用这个方法，并保存返回结果。
// 6.删除刚才新增的属性。
// 7.返回结果。
Function.prototype.myCall = function(context,...args) {
  // 判断调用对象
  if (typeof this !== "function") {
    console.error("type error");
  }
  // 获取参数
  let result = null;
  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;
  // 将调用函数设为对象的方法
  context.fn = this;
  // 调用函数
  result = context.fn(...args);
  // 将属性删除
  delete context.fn;
  return result;
};

// 7. 手写 apply 函数
// apply 函数的实现步骤：

// 1.判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
// 2.判断传入上下文对象是否存在，如果不存在，则设置为 window 。
// 3.将函数作为上下文对象的一个属性。
// 4.判断参数值是否传入
// 5.使用上下文对象来调用这个方法，并保存返回结果。
// 6.删除刚才新增的属性
// 7.返回结果

// apply 函数实现
Function.prototype.myApply = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  let result = null;
  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;
  // 将函数设为对象的方法
  context.fn = this;
  // 调用方法
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  // 将属性删除
  delete context.fn;
  return result;
};

// 8. 手写 bind 函数
// bind 函数的实现步骤：

// 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
// 保存当前函数的引用，获取其余传入参数值。
// 创建一个函数返回
// 函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象。
// bind 函数实现
Function.prototype.myBind = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  var args = [...arguments].slice(1),
      fn = this;
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
}

// 9. 函数柯里化的实现
// 函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

function curry(fn, args) {
  // 获取函数需要的参数长度
  let length = fn.length;

  args = args || [];

  return function() {
    let subArgs = args.slice(0);

    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }

    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}

// es6 实现
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

// 10. 实现AJAX请求
// AJAX是 Asynchronous JavaScript and XML 的缩写，指的是通过 JavaScript 的 异步通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。

// 创建AJAX请求的步骤：

// 创建一个 XMLHttpRequest 对象。
// 在这个对象上使用 open 方法创建一个 HTTP 请求，open 方法所需要的参数是请求的方法、请求的地址、是否异步和用户的认证信息。
// 在发起请求前，可以为这个对象添加一些信息和监听函数。比如说可以通过 setRequestHeader 方法来为请求添加头信息。还可以为这个对象添加一个状态监听函数。一个 XMLHttpRequest 对象一共有 5 个状态，当它的状态变化时会触发onreadystatechange 事件，可以通过设置监听函数，来处理请求成功后的结果。当对象的 readyState 变为 4 的时候，代表服务器返回的数据接收完成，这个时候可以通过判断请求的状态，如果状态是 2xx 或者 304 的话则代表返回正常。这个时候就可以通过 response 中的数据来对页面进行更新了。
// 当对象的属性和监听函数设置完成后，最后调用 sent 方法来向服务器发起请求，可以传入参数作为发送的数据体。
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", SERVER_URL, true);
// 设置状态监听函数
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function() {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 发送 Http 请求
xhr.send(null);

// 11.深拷贝

// 深拷贝的实现
function deepClone(object) {
  if (!object || typeof object !== "object") return;

  let newObject = Array.isArray(object) ? [] : {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key] =
        typeof object[key] === "object" ? deepClone(object[key]) : object[key];
    }
  }

  return newObject;
}


// 二  数据处理

// 1.日期格式化
const dateFormat = (dateInput, format)=>{
    var day = dateInput.getDate() 
    var month = dateInput.getMonth() + 1  
    var year = dateInput.getFullYear()   
    format = format.replace(/yyyy/, year)
    format = format.replace(/MM/,month)
    format = format.replace(/dd/,day)
    return format
}

dateFormat(new Date('2020-12-01'), 'yyyy/MM/dd') // 2020/12/01
dateFormat(new Date('2020-04-01'), 'yyyy/MM/dd') // 2020/04/01
dateFormat(new Date('2020-04-01'), 'yyyy年MM月dd日') // 2020年04月01日

// 2. Array flatten
// 2.1 遍历 
function flatten(arr) {
  let result = [];

  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
// 2.2 reduce
function flatten(arr) {
  return arr.reduce(function(prev, next){
      return prev.concat(Array.isArray(next) ? flatten(next) : next)
  }, [])
}
// 2.3 扩展运算符
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
      arr = [].concat(...arr);
  }
  return arr;
}
//2.4 split && toString
// 可以通过 split 和 toString 两个方法来共同实现数组扁平化，由于数组会默认带一个 toString 的方法，所以可以把数组直接转换成逗号分隔的字符串，然后再用 split 方法把字符串重新转换为数组
function flatten(arr) {
  return arr.toString().split(',');
}
// 2.5 es6 flat
function flatten(arr) {
  return arr.flat(Infinity);
}

// 3.数组去重

// 3.1 es6 set
Array.from[new Set(arr)]  
// [...new Set(arr)]

// 3.2 es5 map
function uniqueArray(array) {
  let map = {};
  let res = [];
  for(var i = 0; i < array.length; i++) {
    if(!map.hasOwnProperty([array[i]])) {
      map[array[i]] = 1;
      res.push(array[i]);
    }
  }
  return res;
}

// 4.String repaet
function repeat(s, n) {
  return (new Array(n + 1)).join(s);
}

// 5. js arr => tree
function jsonToTree(data) {
  // 初始化结果数组，并判断输入数据的格式
  let result = []
  if(!Array.isArray(data)) {
    return result
  }
  // 使用map，将当前对象的id与当前对象对应存储起来
  let map = {};
  data.forEach(item => {
    map[item.id] = item;
  });
  // 
  data.forEach(item => {
    let parent = map[item.pid];
    if(parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

// 6.解析URL Params 为对象

let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled';
parseParam(url)
/* 结果
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}
*/
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    if (/=/.test(param)) { // 处理有 value 的参数
      let [key, val] = param.split('='); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
      if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else { // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else { // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  })
  return paramsObj;
}


// 三 场景运用

// 1.用Promise实现图片的异步加载

let imageAsync=(url)=>{
  return new Promise((resolve,reject)=>{
      let img = new Image();
      img.src = url;
      img.οnlοad=()=>{
          console.log(`图片请求成功，此处进行通用操作`);
          resolve(image);
      }
      img.οnerrοr=(err)=>{
          console.log(`失败，此处进行失败的通用操作`);
          reject(err);
      }
  })
}

imageAsync("url").then(()=>{
console.log("加载成功");
}).catch((error)=>{
console.log("加载失败");
})

// 2.实现发布-订阅模式
class EventCenter{
  // 1. 定义事件容器，用来装事件数组
    handlers = {}

  // 2. 添加事件方法，参数：事件名 事件方法
  addEventListener(type, handler) {
    // 创建新数组容器
    if (!this.handlers[type]) {
      this.handlers[type] = []
    }
    // 存入事件
    this.handlers[type].push(handler)
  }

  // 3. 触发事件，参数：事件名 事件参数
  dispatchEvent(type, params) {
    // 若没有注册该事件则抛出错误
    if (!this.handlers[type]) {
      return new Error('该事件未注册')
    }
    // 触发事件
    this.handlers[type].forEach(handler => {
      handler(...params)
    })
  }

  // 4. 事件移除，参数：事件名 要删除事件，若无第二个参数则删除该事件的订阅和发布
  removeEventListener(type, handler) {
    if (!this.handlers[type]) {
      return new Error('事件无效')
    }
    if (!handler) {
      // 移除事件
      delete this.handlers[type]
    } else {
      const index = this.handlers[type].findIndex(el => el === handler)
      if (index === -1) {
        return new Error('无该绑定事件')
      }
      // 移除事件
      this.handlers[type].splice(index, 1)
      if (this.handlers[type].length === 0) {
        delete this.handlers[type]
      }
    }
  }
}

// 3. 实现双向数据绑定
let obj = {}
let input = document.getElementById('input')
let span = document.getElementById('span')
// 数据劫持
Object.defineProperty(obj, 'text', {
  configurable: true,
  enumerable: true,
  get() {
    console.log('获取数据了')
  },
  set(newVal) {
    console.log('数据更新了')
    input.value = newVal
    span.innerHTML = newVal
  }
})
// 输入监听
input.addEventListener('keyup', function(e) {
  obj.text = e.target.value
})

// 4. 使用 setTimeout 实现 setInterval

// setInterval 的作用是每隔一段指定时间执行一个函数，但是这个执行不是真的到了时间立即执行，它真正的作用是每隔一段时间将事件加入事件队列中去，只有当当前的执行栈为空的时候，才能去从事件队列中取出事件执行。所以可能会出现这样的情况，就是当前执行栈执行的时间很长，导致事件队列里边积累多个定时器加入的事件，当执行栈结束的时候，这些事件会依次执行，因此就不能到间隔一段时间执行的效果。

// 针对 setInterval 的这个缺点，我们可以使用 setTimeout 递归调用来模拟 setInterval，这样我们就确保了只有一个事件结束了，我们才会触发下一个定时器事件，这样解决了 setInterval 的问题。

// 实现思路是使用递归函数，不断地去执行 setTimeout 从而达到 setInterval 的效果

function mySetInterval(fn, timeout) {
  // 控制器，控制定时器是否继续执行
  var timer = {
    flag: true,
    clear: function() {
      this.flag = false
    }
  };
  // 设置递归函数，模拟定时器执行。
  function interval() {
    if (timer.flag) {
      fn();
      setTimeout(interval, timeout);
    }
  }
  // 启动定时器
  setTimeout(interval, timeout);
  // 返回控制器
  return timer;
}