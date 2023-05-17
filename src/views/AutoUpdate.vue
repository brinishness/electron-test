<template>
    <div class="systemExample width100 height100">
        <main>
            <div class="right-side">
                <div class="doc">
                    <div class="title alt">您可以点击的按钮测试功能</div>
                    <el-button type="primary" round @click="getSystemInfo">获取系统信息</el-button>
                    <el-button type="primary" round @click="CheckUpdate">检查更新, 不可用于开发环境</el-button>
                    <!-- <el-progress :percent="this.percent" v-show="show">更新进度</el-progress> -->
                    <el-button type="primary" round @click="downloadUpdate">手动下载更新文件</el-button>
                    <el-progress :text-inside="true" :stroke-width="24" :percentage="percent"></el-progress>
                    <el-button type="primary" round @click="changeTheme('light')">亮色</el-button>
                    <el-button type="primary" round @click="changeTheme('dark')">暗色</el-button>

                </div>
            </div>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";

const version = '1.2.0'
import {ElButton, ElProgress, ElMessage, ElMessageBox} from 'element-plus'
import {useRoute} from "vue-router";

let ipcRenderer = require("electron").ipcRenderer;
const {dialog} = require("electron");
const route = useRoute();
console.log(route.query);
console.log(window.location.href);
const percent = ref(0);
const show = ref(false);
const getSystemInfo = () => {
    ipcRenderer.send('getSystemInfo');
}
// 主进程返回检查状态
ipcRenderer.on('getSystemInfo', (e, data) => {
    console.log(data);
})
ipcRenderer.on("message", (e, data) => {
    console.log("status--->", data.status);
    switch (data.status) {
        // 检查更新出错 or 已经是最新版本
        case -1:
            console.log("data.msg--->", data.msg);
            break;
        // 正在检查更新
        case 0:
            console.log("data.msg--->", data.msg)
            break;

        // 检测到新本版
        case 1:
            console.log("data.msg--->", data.msg)
            ElMessageBox.confirm("检测到新版本，是立即下载", "提示", {
                closeOnClickModal: false, // 禁止点击遮罩关闭弹框
                closeOnPressEscape: false, // 禁止按 ECS 建古纳比弹框
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                message: "本次更新内容：\n" + data.msg,
            })
                .then(() => {
                    ipcRenderer.send("downloadUpdate");
                })
                .catch(() => {
                    // logger.info("取消下载新版本");
                    ElMessage({
                        message: "取消下载",
                        type: "warning",
                    });
                });

        // 正在下载
        case 2:
            console.log("data.msg--->", data.msg)
    }
});

// 有可用更新包
ipcRenderer.on("update-available", (e, info) => {
    // 获取当前版本信息
    console.log("当前版本=", version);
    console.log("info--->", info);
});
// 更新进度
ipcRenderer.on("downloadProgress", (e, progressObj) => {
    console.log("progressObj--->", progressObj);
    if (Math.trunc(percent.value) === 100) {
        show.value = false;
        ElMessageBox.confirm("下载完成，是否立即更新", "提示", {
            closeOnClickModal: false, // 禁止点击遮罩关闭弹框
            closeOnPressEscape: false, // 禁止按 ECS 键关闭弹框
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            ipcRenderer.send('isUpdateNow');
            ElMessage({
                type: 'success',
                message: '更新成功'
            })
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '取消更新'
            })
        })
    }
});

// 是否立即下载
ipcRenderer.on("isUpdateNow", (e, data) => {
    console.log("isUpdateNow---->", data);

    ElMessageBox.confirm("下载已完成，是否立即安装", "提示", {
        closeOnClickModal: false, // 禁止点击遮罩关闭弹框
        closeOnPressEscape: false, // 禁止按 ECS 键关闭弹框
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            ipcRenderer.send("handleUpdateNow");
            ElMessage({
                type: "success",
                message: "成功下载",
            });
        })
        .catch(() => {
            // logger.info("下载完成，取消安装");
            ElMessage({
                type: "info",
                message: "已取消更新",
            });
        });
});

ipcRenderer.on('downloadProgress', (event, progressObj) => {
    percent.value = progressObj.percent.toFixed(2) || 0
    console.log("percent---->", Math.trunc(percent.value))
    console.log(Math.trunc(percent.value) === 100)
    if (Math.trunc(percent.value) === 100) {
        console.log('开始更新')
    }
})

ipcRenderer.on("updateMessage", (event, data) => {
    console.log('updateMessage', data);
})
const downloadUpdate = () => {
    console.log('2222');
    ElMessageBox.confirm("下载完成，是否立即更新", "提示", {
        closeOnClickModal: false, // 禁止点击遮罩关闭弹框
        closeOnPressEscape: false, // 禁止按 ECS 键关闭弹框
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        ipcRenderer.send('handleUpdateNow');
        ElMessage({
            type: 'success',
            message: '更新成功'
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消更新'
        })
    })
    // ipcRenderer.send("downloadUpdate")
}
const CheckUpdate = () => {
    console.log('1111');
    ipcRenderer.send("checkForUpdate")
}
const changeTheme = (color: string) => {
    ipcRenderer.send('changeTheme', color)
}
</script>

<style scoped></style>
