import { alert } from "./alert.js";
/***************/
//封装post，get请求
/***************/
export const ajax = {
    get: function (url, header, data) {
        let urlArr = url.split('/');
        let urlLast = urlArr[urlArr.length - 1];//显示接口的请求地址
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url, //开发者服务器接口地址",
                data: data, //请求的参数",
                method: 'GET',
                header: header,
                dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
                success: res => {
                    // 对返回的错误码进行处理
                    requestResult(res, urlLast, (result) => {
                        resolve(result);
                    }, (result)=>{
                        reject(result);
                    });
                },
                fail: () => {//只有网络请求超时(app.json 可以调请求时间)，网络出现问题时才会进入fail函数
                    alert.toast(`网络好像出错了！（${urlLast}）`);
                    reject();
                },
                complete: () => {
                }
            });
        });
    },
    post: function (url, header, data) {
        let urlArr = url.split('/');
        let urlLast = urlArr[urlArr.length - 1];//显示接口的请求地址
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url, //开发者服务器接口地址",
                data: data, //请求的参数",
                method: 'POST',
                header: header,
                dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
                success: res => {
                    // 对返回的错误码进行处理
                    requestResult(res, urlLast, (result) => {
                        resolve(result);
                    }, (result) => {
                        reject(result);
                    });
                },
                fail: () => {//只有网络请求超时(app.json 可以调请求时间)，网络出现问题时才会进入fail函数
                    alert.toast(`网络好像出错了！（${urlLast}）`);
                    reject();

                },
                complete: () => {
                }
            });
        })

    },
    put: function (url, header, data) {
        let urlArr = url.split('/');
        let urlLast = urlArr[urlArr.length - 1];//显示接口的请求地址
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url, //开发者服务器接口地址",
                data: data, //请求的参数",
                method: 'PUT',
                header: header,
                dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
                success: res => {
                    // 对返回的错误码进行处理
                    requestResult(res, urlLast, (result) => {
                        resolve(result);
                    }, (result) => {
                        reject(result);
                    });
                },
                fail: () => {//只有网络请求超时(app.json 可以调请求时间)，网络出现问题时才会进入fail函数
                    alert.toast(`网络好像出错了！（${urlLast}）`);
                    reject();

                },
                complete: () => {
                }
            });
        })

    },
    delete: function (url, header , data) {
        let urlArr = url.split('/');
        let urlLast = urlArr[urlArr.length - 1];//显示接口的请求地址
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url, //开发者服务器接口地址",
                data: data, //请求的参数",
                method: 'DELETE',
                header: header,
                dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
                success: res => {
                    // 对返回的错误码进行处理
                    requestResult(res, urlLast, (result) => {
                        resolve(result);
                    }, (result) => {
                        reject(result);
                    });
                },
                fail: () => {//只有网络请求超时(app.json 可以调请求时间)，网络出现问题时才会进入fail函数
                    alert.toast(`网络好像出错了！（${urlLast}）`);
                    reject();
                },
                complete: () => {
                }
            });
        });
    },

} 


// 对返回的错误码进行处理
function requestResult(res, urlLast,resolve, reject){
    if (res) {//有返回数据，接口调用结束
        if (res.data.success == true) {//请求成功

            resolve(res.data.result);

        } else if (res.data.success == false) {//请求失败，服务器内部出现错误
            let errorCode = res.data.error.code;
            if (errorCode == 401) {//用户信息过期
                alert.model(`用户信息过期，请退出重新登录！`, false);
                reject(errorCode);
            } else if (errorCode == 400) {//提交信息错误
                alert.model(`${res.data.error.message}`, false);
                reject(errorCode);
            } else if (errorCode == 402 || errorCode == 408) {//用户未注册【登录接口时】
                reject(errorCode);
            } else if (errorCode == 403) {//用户没有该调用权限【登录接口时】
                alert.model(`您还没有此调用权限！`, false);
                reject(errorCode);
            } else if (errorCode == 412) {//登录时，刷新令牌无效【登录接口时】
                reject(errorCode);
            } else if (errorCode != 0) {//出现错误，错误码不为0时 ，直接显示出错误文本
                alert.model(`${res.data.error.message}`, false);
                reject(errorCode);
            } else if (res.data.error.message) {//出现错误
                alert.model(`${res.data.error.message},${res.data.error.validationErrors}（${urlLast}）`, false);
                reject();
            }

        }
    }
    alert.hide();//隐藏toast
}