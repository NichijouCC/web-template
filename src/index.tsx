import React from "react";
import { APP } from "./app";
import { initAxiosConfig } from "./services/axiosClient";
import { MyApp } from "./__internal";

MyApp.start(<APP />, {
    onInit: () => initAxiosConfig()
});


function fakeRequest() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(1), 1000);
    })
}
function wrapRequest() {
    // 代码逻辑
    // 如果当前没有在发起请求（或上次请求已发起并返回），（重新）发起一次请求
    // 如果有请求正在发起并且未返回，使用这一次请求的返回结果
    let request: Promise<any>;
    return function () {
        // 实际在业务代码中会调用这个 function
        // 代码逻辑，最终返回 Promise 实例，拿到结果
        if (request == null) {
            request = fakeRequest();
            request.then(() => request = null);
            return request;
        } else {
            return request;
        }
    }
}


const wrapped = wrapRequest();
// 只会发起一次 request 请求，都复用第一次 request 服务端返回的结果

setTimeout(() => {
    wrapped().then(n => { console.log(n); });
    wrapped().then(n => { console.log(n); });
    wrapped().then(n => { console.log(n); });
}, 2e3);