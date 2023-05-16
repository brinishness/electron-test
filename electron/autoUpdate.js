const {app, ipcMain, BrowserWindow, dialog} = require("electron");
// 注意这个autoUpdater不是electron中的autoUpdater
const {autoUpdater, CancellationToken} = require("electron-updater");
const logger = require("electron-log");
const path = require("path");
const fs = require('fs-extra')
// const serveControll = require("./api/event/serveControll")
// const config = require('../package.json')

// 更新地址
const updateURL =
    "http://127.0.0.1:1234"; // 安装包下载地址
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function handleUpdate(mainWindow, callback) {
    // 若执行删除操作，每次检查更新都会重新下载更新包，
    // 若不执行删除操作,在已有更新包的情况下,会直接跳过下载事件,直接进行安装操作
    deleteUpdate();

    const message = {
        error: {status: -1, msg: "检查更新出错"},
        checking: {status: 0, msg: "正在检查更新……"},
        updateAva: {status: 1, msg: "检测到新版本，正在下载……"},
        updateNotAva: {status: -1, msg: "已经是最新版本"},
        // updateDownload:{status: 2,msg: '正在下载'}
    };

    // 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
    autoUpdater.autoDownload = false;

    autoUpdater.autoInstallOnAppQuit = false; // 如果安装包下载好了，当应用退出后是否自动安装更新

    // 设置版本更新服务器地址
    autoUpdater.setFeedURL(updateURL);

    // 更新发生错误时触发
    autoUpdater.on("error", function (error) {
        logger.error(error);
        logger.error("检查更新出错");
        sendUpdateMessage(message.error);
    });

    // 开始检查更新事件
    autoUpdater.on("checking-for-update", function () {
        logger.info("开始检查更新");
        sendUpdateMessage(message.checking);
    });

    // 没有可更新版本
    autoUpdater.on("update-not-available", function (info) {
        logger.info("已经是最新的版本");
        sendUpdateMessage(message.updateNotAva);
    });

    // 发现可更新版本
    autoUpdater.on("update-available", function (info) {
        logger.debug("发现新版本");
        logger.info("新版本信息：", info);
        // 获取当前版本信息
        // logger.info("localVersion---->",config.version)
        sendUpdateMessage(message.updateAva);
        mainWindow.webContents.send("update-available", info);
    });

    // 更新下载进度事件
    autoUpdater.on("download-progress", function (progressObj) {
        logger.debug("下载进度事件 ... ");
        logger.info("progressObj--->", progressObj);
        let info = {
            bytesPerSecond: progressObj.bytesPerSecond,
            percent: progressObj.percent,
            transferred: progressObj.transferred,
            total: progressObj.total,
        };
        mainWindow.webContents.send("downloadProgress", info);
    });

    // 下载监听
    autoUpdater.on(
        "update-downloaded",
        function (
            event,
            releaseNotes,
            releaseName,
            releaseDate,
            updateUrl,
            quitAndUpdate
        ) {
            logger.info("下载完毕");
            let data = {
                releaseDate,
                releaseName,
                releaseNotes,
                updateUrl,
                quitAndUpdate,
            };
            logger.info("releaseInfo---->", data);
            // autoUpdater.quitAndInstall();
            // callback()
            // 接收到立即更新的信号，退出程序并更新
            // ipcMain.on("isUpdateNow", (e, arg) => {
            // serveControll.stopServer(); // 关闭后台服务
            // logger.info(arg);
            // logger.info("开始更新");
            // 3秒后退出并安装，可控制
            // setTimeout(() => {
            // autoUpdater.quitAndInstall();
            // }, 3000);
            // });
            mainWindow.webContents.send("isUpdateNow", data);
        }
    );

    // 自动执行更新检查
    // autoUpdater.checkForUpdates();

    // 检查更新
    ipcMain.on("checkForUpdate", () => {
        // 执行自动更新检查
        logger.info("执行更新检查");
        autoUpdater.checkForUpdates();
    });

    ipcMain.on("downloadUpdate", () => {
        // 下载
        logger.info("下载操作执行");
        // autoUpdater.downloadUpdate()
        autoUpdater
            .downloadUpdate()
            .then((downloadPath) => {
                mainWindow.webContents.send("message", downloadPath)
                logger.info("download path:", downloadPath);
            })
            .catch((e) => {
                logger.info(e);
            });
    });

    // 立即安装
    ipcMain.on("handleUpdateNow", (e, arg) => {
        // serveControll.stopServer(); // 关闭后台服务
        logger.info(arg);
        logger.info("开始更新")
        mainWindow.webContents.send("updateMessage", "111111");
        // console.log("开始安装");
        // 3秒后退出并安装，可控制
        autoUpdater.quitAndInstall();
        mainWindow.webContents.send("updateMessage", "22222");
    });

    // 向渲染进程发送消息
    function sendUpdateMessage(text) {
        mainWindow.webContents.send("message", text);
    }
}

// 更新前先删除本地已经下载的更新包文件
function deleteUpdate() {
    let updateCacheDirName = "tears-updater";
    // 更新包下载路径
    const updatePendingPath = path.join(
        autoUpdater.app.baseCachePath,
        updateCacheDirName,
        "pending"
    );
    logger.info("updatePendingPath=", updatePendingPath);
    // 删除本地安装包
    fs.emptyDir(updatePendingPath);
}

module.exports = {
    handleUpdate,
};
