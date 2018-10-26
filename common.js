import { ajax } from "./commonAjax.js";
import { isoVerdue } from "../api/common/login.js";


// 循环检查用户的登录状态
export function inspectLoginStatus(fun){

    // 判断登录获取的token是否过期了
    isoVerdue().then(() => {//token有效
        fun();
    },()=>{
        setTimeout(() => {//token无效
            inspectLoginStatus(fun);
        }, 1000);
    })

}

// 页面post请求，带用户信息 token
export function POST(that,url,data) {
    return new Promise(function (resolve, reject){

        // 循环检查用户的登录状态
        inspectLoginStatus(()=>{
            // 缓存获取token
            var token = wx.getStorageSync('token');

            // 请求域名头
            var serverUrl;
            if (that.hasOwnProperty('globalData')){
                serverUrl = that.globalData.serverUrl;
            }else if (that.$parent.hasOwnProperty('globalData')) {
                serverUrl = that.$parent.globalData.serverUrl;
            } else if (that.$parent.$parent.hasOwnProperty('globalData')) {
                serverUrl = that.$parent.$parent.globalData.serverUrl;
            }

            ajax.post(`${serverUrl}${url}`, token, data).then((e)=>{//接口调用成功
                resolve(e);

            }, (statusCode) => {//接口调用失败
                reject(statusCode);
            })
        });
    })
}

// 页面get请求，带用户信息 token
export function GET(that, url , data) {
    return new Promise(function (resolve, reject) {

        // 循环检查用户的登录状态
        inspectLoginStatus(() => {
            // 缓存获取token
            var token = wx.getStorageSync('token');

            // 请求域名头
            var serverUrl;
            if (that.$parent.hasOwnProperty('globalData')){
                serverUrl = that.$parent.globalData.serverUrl;
            } else if (that.$parent.$parent.hasOwnProperty('globalData')){
                serverUrl = that.$parent.$parent.globalData.serverUrl;
            }

            ajax.get(`${serverUrl}${url}`, token , data).then((e) => {//接口调用成功
                resolve(e);

            }, (statusCode) => {//接口调用失败
                reject(statusCode);
            })
        });
    })
}

// 页面post请求，带用户信息 token
export function PUT(that, url, data) {
    return new Promise(function (resolve, reject) {

        // 循环检查用户的登录状态
        inspectLoginStatus(() => {
            // 缓存获取token
            var token = wx.getStorageSync('token');

            // 请求域名头
            var serverUrl;
            if (that.$parent.hasOwnProperty('globalData')) {
                serverUrl = that.$parent.globalData.serverUrl;
            } else if (that.$parent.$parent.hasOwnProperty('globalData')) {
                serverUrl = that.$parent.$parent.globalData.serverUrl;
            }

            ajax.put(`${serverUrl}${url}`, token, data).then((e) => {//接口调用成功
                resolve(e);

            }, (statusCode) => {//接口调用失败
                reject(statusCode);
            })
        });
    })
}

// 页面delete请求，带用户信息 token
export function DELETE(that, url , data) {
    return new Promise(function (resolve, reject) {

        // 循环检查用户的登录状态
        inspectLoginStatus(() => {
            // 缓存获取token
            var token = wx.getStorageSync('token');

            // 请求域名头
            var serverUrl;
            if (that.$parent.hasOwnProperty('globalData')) {
                serverUrl = that.$parent.globalData.serverUrl;
            } else if (that.$parent.$parent.hasOwnProperty('globalData')) {
                serverUrl = that.$parent.$parent.globalData.serverUrl;
            }

            ajax.delete(`${serverUrl}${url}`, token, data).then((e) => {//接口调用成功
                resolve(e);

            }, (statusCode) => {//接口调用失败
                reject(statusCode);
            })
        });
    })
}


/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
*
* @return {Function}     返回一个“去弹跳”了的函数
*/

// 去抖动函数
export function debounce(fn, delay) {

    // 定时器，用来 setTimeout
    var timer

    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function () {

        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments

        // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
        clearTimeout(timer)

        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 fn
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}


/**
*
* @param fn {Function}   实际要执行的函数
* @param delay {Number}  执行间隔，单位是毫秒（ms）
*
* @return {Function}     返回一个“节流”函数
*/
// 节流阀函数
export function throttle(fn, threshhold) {
    
    // 记录上次执行的时间
    var last

    // 定时器
    var timer

    // 默认间隔为 500ms
    threshhold || (threshhold = 500)

    // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
    return function () {
        
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments

        var now = +new Date()

        // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
        // 执行 fn，并重新计时
        if (last && now < last + threshhold) {
            // clearTimeout(timer)
            
            // // 保证在当前时间区间结束后，再执行一次 fn
            // timer = setTimeout(function () {
                //   last = now
                //   fn.apply(context, args)
                // }, threshhold)
                
                // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
            } else {
                
            last = now
            fn.apply(context, args)
        }
    }
}
