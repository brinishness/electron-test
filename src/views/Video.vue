<template>
    <div class="about">
        <div id="canvas"></div>
    </div>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";
import NERtcEngine from "nertc-electron-sdk";
const NERtcSDK = require("nertc-electron-sdk").default;
import WebRoomkit from "neroom-web-sdk";

var nertcEngine = new NERtcSDK.NERtcEngine();
let ret = nertcEngine.initialize({
    app_key: "0799fc1781779cc0e754a549d615f95b",
    log_dir: "./log",
    log_level: 4,
    log_file_max_size_KB: 1024,
    log_file_max_keep_days: 3,
});

console.log(`initialize::ret = ${ret}`);

nertcEngine.on("onJoinChannel", (res: any) => {
    console.log("onJoinChannel", res);
});
console.log(nertcEngine);
console.log(WebRoomkit);
const route = useRoute();
console.log(route.query);

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
