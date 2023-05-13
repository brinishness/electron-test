import axios, { AxiosResponse } from "axios";
import {ElLoading, ElMessage } from 'element-plus'
const request = axios.create({
    // baseURL: 'https://nrtc.netease.im/demo/getChecksum.action',
    timeout: 5000,
})
let loadingInstance;
let loading;
// 内存中正在请求的数量
let loadingNum = 0;

function startLoading() {
    if (loadingNum === 0) {
        loadingInstance = ElLoading.service({
            lock: true,
            text: 'Loading',
            // spinner: 'el-icon-loading',
        })
    }
    // 请求数量加1
    loadingNum++;
}

function endLoading() {
    // 请求数量减1
    loadingNum--;
    if (loadingNum <= 0) {
        loadingInstance.close();
    }
}

request.interceptors.request.use((config) => {
        console.log('请求拦截器');
        if (config.method === 'post') {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
        // if(!config.params.needLoading){
            startLoading()
        // }
        return config
    },
    (error) => {
        console.log(error)
    })
request.interceptors.response.use((response: AxiosResponse) => {
    console.log('响应拦截器');
    // if(!response.config.params.needLoading){
        endLoading()
    // }
    return response
}, (error) => {
    console.log('响应拦截器');
    ElMessage.error({
        message: '未知错误，请联系管理员！',
        type: 'error'
    })
    console.log(error)
    endLoading();
})

export default request;