<template>
    <div class="about">
        <div id="canvas"></div>
    </div>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";
// import NERtcEngine from "nertc-electron-sdk";
const NERtcSDK = require("nertc-electron-sdk").default;
// import WebRoomkit from "neroom-web-sdk";
import {onUnmounted, ref} from "vue";
import type {NERtcEngineContext} from "nertc-electron-sdk/types/api/defs";

const isInit = ref<Boolean>(false);
let nertcEngine = new NERtcSDK.NERtcEngine();
const initSDK = () => {
    let context = <NERtcEngineContext>{}
    context.app_key = '0799fc1781779cc0e754a549d615f95b'
    context.log_level = 3
    context.log_dir_path = './log'
    context.log_file_max_size_KBytes = 0
    let ret = nertcEngine.initialize(context);
    isInit.value = true;
    console.log(`initialize::ret = ${ret}`);
}

if (!isInit.value) {
    initSDK();
}
// console.log(WebRoomkit);
const route = useRoute();
console.log(route.query);
onUnmounted(() => {
    nertcEngine.release();
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
