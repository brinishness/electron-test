<template>
    <div class="about">
        <el-input placeholder="房间号" v-model="roomnumber"></el-input>
        <el-button type="primary" round @click="createUser">创建用户</el-button>
        <el-button type="primary" round @click="userLogin">用户登录</el-button>
        <el-button type="primary" round @click="createRoom">创建房间</el-button>
        <el-button type="primary" round @click="joinRoom">进入房间</el-button>
        <el-button type="primary" round @click="leaveRoom">离开房间</el-button>
        <el-button type="primary" round @click="removeRoom">删除房间</el-button>
        <el-button type="primary" round @click="members">房间状态</el-button>
        <el-button type="primary" round @click="share">分享</el-button>
        <div id="canvas"></div>
        <div v-for="(item, index) in sources" :key="index" @click="changeSource(item.id)">
            {{ item.name }}
        </div>
        <video autoplay playsinline></video>
<!--        <video ref="refs" style="width: 300px;" @mouseenter="mouseEnter(index)" autoplay playsinline v-for="(item, index) in srcs" :srcObject="item.src" :key="index"></video>-->
    </div>
</template>
<script lang="ts" setup>
import {ElButton, ElInput} from "element-plus";
import {useRoute} from "vue-router";

const ipcRenderer = require("electron").ipcRenderer;
// import NERtcEngine from "nertc-electron-sdk";
// const NERtcSDK = require("nertc-electron-sdk").default;
import NERTC from "nertc-web-sdk"
// import WebRoomkit from "neroom-web-sdk";
import {onMounted, onUnmounted, ref} from "vue";
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
const refs = ref([]);
const {desktopCapturer} = require('electron')
const sources = ref([]);
rtc.client = NERTC.createClient({
    // appkey: 'a88f59cb25cdc1dbf437529f03d6f062', //您的 App Key
    appkey: 'a88f59cb25cdc1dbf437529f03d6f062', //您的 App Key
    debug: true, //是否开启调试日志
});
console.log(rtc.client);
const roomnumber = ref<string>("");
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
const userLogin = () => {
    NEAuthService.login("13164816910", "O6UDU4HF1E17NZUDOIMJJ8K3").then(res => {
        console.log(res, 'login success')
    }).catch(err => {
        console.error(err, 'login fail')
    })
}
const NERoomService = roomkitInstance.roomService;
// 销毁sdk
// createUser({
//     accid: "13164816911",
//     name: 'tears'
// }).then(res=>{
//     console.log(res);
// })
const createUser = () => {
    createRoomUser(131618416910, {
        appKey: 'a88f59cb25cdc1dbf437529f03d6f062',
        userUuid: '13164816910',
        userName: 'tears',
    })
}
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
        templateId: 40,
        roomName: '123455',
        roomUuid: roomnumber.value
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
const srcs = ref([]);
const removeRoom = () => {
    /**
     * @param roomUuid 房间ID
     */
    const NERoomContext = NERoomService.getRoomContext(roomnumber.value)
    console.log(NERoomContext);
    NERoomContext.endRoom().then(() => {
        console.log('endRoom success')
    }).catch(err => {
        console.error(err, 'endRoom fail')
    })

}
const joinRoom = () => {
    /**
     * 加入房间
     * @param params.role 用户加入房间的角色
     * @param params.userName 用户名
     * @param params.roomUuid 房间ID
     */

    NERoomService.joinRoom(<NEJoinRoomParams>{
        role: 'host', // 示例数据
        roomUuid: roomnumber.value,
        userName: 'tears'
    }, {}).then(res => {
        console.log('joinRoom success')
    }).catch(err => {
        console.error(err, 'joinRoom error')
    })

}

const leaveRoom = () => {
    /**
     * @param roomUuid 房间ID
     */
    const NERoomContext = NERoomService.getRoomContext(roomnumber.value)

    NERoomContext.leaveRoom().then(() => {
        console.log('leaveRoom success')
    }).catch(err => {
        console.error(err, 'leaveRoom fail')
    })

}
const members = () => {
    const loginStatus = NEAuthService.isLoggedIn
    console.log(loginStatus);

    const NERoomContext = NERoomService.getRoomContext(roomnumber.value);
    const localMember = NERoomContext.localMember;
    console.log(localMember);
    const remoteMembers = NERoomContext.remoteMembers;
    console.log(remoteMembers);

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
// }    // try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: {
//             mandatory: {
//                 chromeMediaSource: 'desktop',
//                 chromeMediaSourceId: sourceId,
//                 minWidth: 1280,
//                 maxWidth: 1280,
//                 minHeight: 720,
//                 maxHeight: 720
//             }
//         }
//     })
//     handleStream(stream)
// } catch (e) {
//     handleError(e)
// }
// console.log(WebRoomkit);
const route = useRoute();
console.log(route.query);
// onUnmounted(() => {
//     nertcEngine.release();
// })
const share = () => {
    console.log(111);
    ipcRenderer.send('getSource');
}
ipcRenderer.on('SET_SOURCE', async (event, so) => {
    console.log(so);
    sources.value = so;
    so.map(async (item, index) => {
        console.log('item-----', item);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: item.id,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
            const obj = {src: stream}
            srcs.value.push(obj);

        } catch (e) {
            handleError(e)
        }
    })
    // try {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //         audio: false,
    //         video: {
    //             mandatory: {
    //                 chromeMediaSource: 'desktop',
    //                 chromeMediaSourceId: sourceId,
    //                 minWidth: 1280,
    //                 maxWidth: 1280,
    //                 minHeight: 720,
    //                 maxHeight: 720
    //             }
    //         }
    //     })
    //     handleStream(stream)
    // } catch (e) {
    //     handleError(e)
    // }
})
const mouseEnter = (index) => {
    console.log(111);
    // document.querySelectorAll("video")[index].style.width = '500px';
    refs.value[index].style.width = '500px';
}
const changeSource = async (sourceId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        })
        handleStream(stream)
    } catch (e) {
        handleError(e)
    }
}

function handleStream(stream) {
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
}

function handleError(e) {
    console.log(e)
}

onMounted(async () => {
    navigator.mediaDevices.enumerateDevices().then(res => {
        console.log(res);
        const data = res.filter((item)=>{
            return item.kind === 'videoinput';
        })
        console.log(data);
    })
    const constraints = {
        video: true,
        audio: true,
    };
// 非安全模式（非https/localhost）下 navigator.mediaDevices 会返回 undefined
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log(stream);
        document.querySelector('video').srcObject = stream;
    } catch (error) {
        console.error(error);
    }
    // In the renderer process.

    // await desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
    //     if (error) throw error
    //     for (let i = 0; i < sources.length; ++i) {
    //         if (sources[i].name === 'Electron') {
    //             navigator.mediaDevices.getUserMedia({
    //                 audio: false,
    //                 video: {
    //                     mandatory: {
    //                         chromeMediaSource: 'desktop',
    //                         chromeMediaSourceId: sources[i].id,
    //                         minWidth: 1280,
    //                         maxWidth: 1280,
    //                         minHeight: 720,
    //                         maxHeight: 720
    //                     }
    //                 }
    //             }, handleStream, handleError)
    //             return
    //         }
    //     }
    // })

    // function handleStream(stream) {
    //     document.querySelector('video').src = URL.createObjectURL(stream)
    // }

    // function handleError(e) {
    //     console.log(e)
    // }
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
