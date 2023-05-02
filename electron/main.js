// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const url = require("url");
require('update-electron-app')();
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true // 关闭控制台的警告
const packager = require('electron-packager')

packager({
  dir: "../dist",
  osxSign: {},
  osxNotarize: {
    appleId: '596231290@qq.com',
    appleIdPassword: 'Ming13164816910'
  }
}).then(r => console.log(r))
function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // 书写渲染进程中的配置
      nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: false, // 可以使用require方法
      enableRemoteModule: true, // 可以使用remote方法
    },
  });
  // 配置热更新
  let env = "pro2";

  if (env == "pro") {
    const elePath = path.join(__dirname, "../node_modules/electron");
    require("electron-reload")("../", {
      electron: require(elePath),
    });
    // 热更新监听窗口
    mainWindow.loadURL("http://127.0.0.1:5173");
    // 打开开发工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境中要加载文件，打包的版本
    // Menu.setApplicationMenu(null)
    // 加载 index.html
    // mainWindow.loadFile(path.resolve(__dirname, "../dist/index.html")); // 新增
    mainWindow
      .loadURL(
        url.format({
          pathname: path.join(__dirname, "../dist/index.html"),
          protocol: "file:",
          slashes: true,
          hash: "about",
        })
      )
      .then((r) => {
        console.log(r);
      });
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function (e) {
  e.preventDefault();
  dialog
    .showMessageBox({
      type: "info",
      title: "提示",
      message: "确认退出？",
      buttons: ["确认", "取消"], //选择按钮，点击确认则下面的idx为0，取消为1
      cancelId: 1, //这个的值是如果直接把提示框×掉返回的值，这里设置成和“取消”按钮一样的值，下面的idx也会是1
    })
    .then((idx) => {
      //注意上面↑是用的then，网上好多是直接把方法做为showMessageBox的第二个参数，我的测试下不成功
      console.log(idx);
      if (idx.response === 1) {
        console.log("index==1，取消关闭");
      } else {
        console.log("index==0，关闭");
        app.exit();
      }
    });
  // if (process.platform !== 'darwin') app.quit()
});
