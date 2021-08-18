const PENDING = 'pending'
const FULLFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromsie {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    // 成功存放的数组
    this.onResolvedCallbacks = []
    // 失败存放法数组
    this.onRejectedCallbacks = []
    let resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULLFILLED
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFullfilled, onRejected) {
    onFullfilled =
      typeof onFullfilled === 'function' ? onFullfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err
          }

    // 声明返回的promise2
    let promise2 = new MyPromsie((resolve, reject) => {
      if (this.state === FULLFILLED) {
        //异步
        setTimeout(() => {
          try {
            let x = onFullfilled(this.value)
            // resolvePromise函数，处理自己return的promise和默认的promise2的关系
            resovlePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }
      if (this.state === REJECTED) {
        //异步
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }
      if (this.state === PENDING) {
        // onFullfilled传入到成功数组
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFullfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    })
    // 返回promise，完成链式
    return promise2
  }
  resovlePromise(promise2, x, resolve, reject) {
    // 循环引用报错
    if (x === promise2) {
      // reject报错
      return reject(new TypeError('Chaining cycle detected for promise'))
    }

    // 防止多次调用
    let called

    // x不是null 且x是对象或者函数
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        // A+规定，声明then = x的then方法
        let then = x.then
        // 如果then是函数，就默认是promise了
        if (typeof then === 'function') {
          // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
          then.call(
            x,
            (y) => {
              // 成功和失败只能调用一个
              if (called) return
              called = true
              // resolve的结果依旧是promise 那就继续解析
              resolvePromise(promise2, y, resolve, reject)
            },
            (err) => {
              // 成功和失败只能调用一个
              if (called) return
              called = true
              reject(err) // 失败了就失败了
            }
          )
        } else {
          resolve(x) // 直接成功即可
        }
      } catch (e) {
        // 也属于失败
        if (called) return
        called = true
        // 取then出错了那就不要在继续执行了
        reject(e)
      }
    } else {
      resolve(x)
    }
  }
  resolve(value) {
    if (this.state === PENDING) {
      this.state = FULLFILLED
      this.value = value
      // 一旦resolve执行，调用成功数组的函数
      this.onResolvedCallbacks.forEach((fn) => fn())
    }
  }
  reject(reason) {
    if (this.state === PENDING) {
      this.state = REJECTED
      this.reason = reason
      // 一旦reject执行，调用失败数组的函数
      this.onRejectedCallbacks.forEach((fn) => fn())
    }
  }
}

// let p = new MyPromsie((resolve) => {
//   setTimeout(() => {
//     console.log('AAA')
//     resolve('AAA')
//   }, 1000)
// })
// p.then(value =>{
//   console.log(value)
// })

MyPromsie.defer = MyPromsie.deferred = function () {
  let dfd = {}
  dfd.promise = new MyPromsie((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
module.exports = MyPromsie
