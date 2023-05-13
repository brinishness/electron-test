<template>
    <div class="about">
        <h1>This is an login page</h1>
        <div id="wx_reg"></div>
        <wxlogin
                :appid="appid"
                :scope="'snsapi_userinfo'"
                :theme="'black'"
                :redirect_uri="redirect_uri"
                rel="external nofollow"
        >
        </wxlogin>
    </div>
</template>
<script lang="ts" setup>
import wxlogin from 'vue-wxlogin'

// import WwLogin from "../libs/wwLogin-1.2.8";
// const WwLogin = require("../libs/wwLogin-1.2.8");
import {useRouter} from "vue-router";
const appid = 'wxdbe71c811d91261f';
const redirect_uri = encodeURI("https://manage.brinishness.top");
const router = useRouter();
let ipcRenderer = require("electron").ipcRenderer;
import {onMounted} from "vue";
import * as ww from "@wecom/jssdk"
// import {createWWLoginPanel} from "@wecom/jssdk";
console.log(WwLogin);
ipcRenderer.on("login", (e, data) => {
    window.location.href = "/update";
    console.log(e, data);
})
onMounted(() => {
    var wwLogin = new WwLogin({
        'id': 'wx_reg',
        'appid': 'ww293767816118f56d',
        'agentid': '1000002',
        'redirect_uri': encodeURI("https://manage.brinishness.top"),
        'state': '',
        'href': ''
    });
    // 初始化
// const wwLogin = ww.createWWLoginPanel({
//   el: '#wx_reg',
//   params: {
//     login_type: 'CorpApp',
//     appid: 'ww293767816118f56d',
//     agentid: '1000002',
//     redirect_uri: encodeURI("https://manage.brinishness.top"),
//     state: 'loginState',
//     redirect_type: 'callback',
//   },
//   onCheckWeComLogin({ isWeComLogin }) {
//     console.log(isWeComLogin)
//   },
//   onLoginSuccess({ code }) {
//     console.log({ code })
//   },
//   onLoginFail(err) {
//     console.log(err)
//   },
// })
})
</script>
<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
