<template>
    <div class="about">
        <el-button type="primary" round @click="createRoom">创建房间</el-button>
        <el-button type="primary" round @click="joinRoom">进入房间</el-button>
        <el-button type="primary" round @click="leaveRoom">离开房间</el-button>
        <el-button type="primary" round @click="removeRoom">删除房间</el-button>
        <div id="canvas"></div>
    </div>
</template>
<script lang="ts" setup>
import {ElButton} from "element-plus";
import {useRoute} from "vue-router";
// import NERtcEngine from "nertc-electron-sdk";
// const NERtcSDK = require("nertc-electron-sdk").default;
import NERTC from "nertc-web-sdk"
// import WebRoomkit from "neroom-web-sdk";
import {onUnmounted, ref} from "vue";
import {createRoomUser, createUser, getToken} from "@/api";
import type {NERtcEngineContext} from "nertc-electron-sdk/types/api/defs";
import WebRoomkit from "neroom-web-sdk";
import type {
    NECreateRoomOptions,
    NECreateRoomParams,
    NEJoinRoomParams
} from "neroom-web-sdk/dist/types/types/roomService";
//创建client实例
let rtc = {};

rtc.client = NERTC.createClient({
    appkey: 'a88f59cb25cdc1dbf437529f03d6f062', //您的 App Key
    debug: true, //是否开启调试日志
});
console.log(rtc.client);

// 初始化
const roomkitInstance = new WebRoomkit()
roomkitInstance.initialize({
    appKey: 'a88f59cb25cdc1dbf437529f03d6f062', // NERoom应用的appkey
});
// getToken({
//     appKey: 'a88f59cb25cdc1dbf437529f03d6f062',
//     userUuid: '13164816910',
// }).then(res => {
//     console.log(res);
// })
// 获取authService和roomService
const NEAuthService = roomkitInstance.authService;
NEAuthService.login("13164816910", "O6UDU4HF1E17NZUDOIMJJ8K3").then(res => {
    console.log(res, 'login success')
}).catch(err => {
    console.error(err, 'login fail')
})
const NERoomService = roomkitInstance.roomService;
console.log(roomkitInstance);
// 销毁sdk
// createUser({
//     accid: "13164816911",
//     name: 'tears'
// }).then(res=>{
//     console.log(res);
// })
// createRoomUser(131618416910, {
//     appKey: 'a88f59cb25cdc1dbf437529f03d6f062',
//     userUuid: '13164816910',
//     userName: 'tears',
// })
onUnmounted(() => {
    roomkitInstance.release()
})

const createRoom = () => {
    /**
     * 创建房间
     * @param params.templateId 模板ID
     * @param params.roomName 房间名称
     * @param params.roomUuid 房间ID
     * @param options.enableRtc 是否需要配置RTC房间
     * @param options.enableChatroom 是否需要配置聊天室房间
     * @param options.enableWhiteboard 是否需要配置白板房间
     */

    const params = <NECreateRoomParams>{
        templateId: '40',
        roomName: '123455',
        roomUuid: '123456'
    }
    const options = <NECreateRoomOptions>{
        enableRtc: true,
        enableChatroom: true,
        enableWhiteboard: true,
        enableRecord: true
    }
    NERoomService.createRoom(params, options).then(res => {
        console.log(res, 'createRoom success')
    }).catch(err => {
        console.error(err, 'createRoom fail')
    })
}
const removeRoom = () => {
    /**
     * @param roomUuid 房间ID
     */
    const NERoomContext = NERoomService.getRoomContext('123456')
    console.log(NERoomContext);
    NERoomContext.endRoom().then(() => {
        console.log('endRoom success')
    }).catch(err => {
        console.error(err, 'endRoom fail')
    })

}
const joinRoom = ()=>{
        /**
     * 加入房间
     * @param params.role 用户加入房间的角色
     * @param params.userName 用户名
     * @param params.roomUuid 房间ID
     */
    NERoomService.joinRoom(<NEJoinRoomParams>{
        role: 'host', // 示例数据
        roomUuid: '123456',
        userName: 'tears'
    },{}).then(res => {
        console.log('joinRoom success')
    }).catch(err => {
        console.error(err, 'joinRoom error')
    })

}

const leaveRoom = ()=>{
    /**
 * @param roomUuid 房间ID
 */
const NERoomContext = NERoomService.getRoomContext('123456')

NERoomContext.leaveRoom().then(() => {
   console.log('leaveRoom success')
}).catch(err => {
   console.error(err, 'leaveRoom fail')
})

}
// const isInit = ref<Boolean>(false);
// let nertcEngine = new NERtcSDK.NERtcEngine();
// const initSDK = () => {
//     let context = <NERtcEngineContext>{}
//     context.app_key = '0799fc1781779cc0e754a549d615f95b'
//     context.log_level = 3
//     context.log_dir_path = './log'
//     context.log_file_max_size_KBytes = 0
//     let ret = nertcEngine.initialize(context);
//     isInit.value = true;
//     console.log(`initialize::ret = ${ret}`);
// }

// if (!isInit.value) {
//     initSDK();
// }
// console.log(WebRoomkit);
const route = useRoute();
console.log(route.query);
// onUnmounted(() => {
//     nertcEngine.release();
// })

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
