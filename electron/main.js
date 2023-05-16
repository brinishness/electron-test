// 控制应用生命周期和创建原生浏览器窗口的模组
const {
    app,
    ipcMain,
    BrowserWindow,
    Menu,
    dialog,
    Notification,
    session,
    systemPreferences,
    desktopCapturer,
    Tray,
    nativeTheme,
} = require("electron");
const path = require("path");
const {format} = require("url");
const Store = require('electron-store');

const store = new Store();

//=> undefined
const {machineId, machineIdSync} = require("node-machine-id");
// require('update-electron-app')();
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true // 关闭控制台的警告
// const packager = require('electron-packager')
//
// packager({
//   dir: "../dist",
//   osxSign: {},
//   osxNotarize: {
//     appleId: '596231290@qq.com',
//     appleIdPassword: 'Ming13164816910'
//   }
// }).then(r => console.log(r))
// const PROTOCOL = 'myapp';
// const args = [];
// if (!app.isPackaged) {
//     args.push(path.resolve(process.argv[1]));
// }
// args.push('--');
//
// app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);
const autoUpdate = require("./autoUpdate");
let mainWindow;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            // 书写渲染进程中的配置
            nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
            contextIsolation: false, // 可以使用require方法
            enableRemoteModule: true, // 可以使用remote方法
            webSecurity: false,
        },
    });
    // 配置热更新
    let env = process.env.NODE_ENV;
    console.log(process.env);

    if (env == "development") {
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
                format({
                    pathname: path.join(__dirname, "../dist/index.html"),
                    protocol: "file:",
                    slashes: false,
                    hash: "",
                })
            )
            .then((r) => {
                console.log(r);
            });
    }
    nativeTheme.themeSource = store.get("theme") || "system";
    autoUpdate.handleUpdate(mainWindow);
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow();
    const mqtt = require("mqtt");

    const host = "emqx.brinishness.eu.org";
    const port = "8523";
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const connectUrl = `tcp://${host}:${port}`;
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: "tears",
        password: "qjm13164816910",
        reconnectPeriod: 1000,
    });

    const topic = "test";
    client.on("connect", () => {
        console.log("Connected");
        client.subscribe([topic], () => {
            console.log(`Subscribe to topic '${topic}'`);
        });
        client.publish(
            topic,
            "nodejs mqtt test",
            {qos: 0, retain: false},
            (error) => {
                if (error) {
                    console.error(error);
                }
            }
        );
    });
    client.end(true, () => {
        console.log("Disconnected");
    });
    setTimeout(() => {
        client.reconnect({
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: "tears",
            password: "qjm13164816910",
            reconnectPeriod: 1000,
        });
    }, 1000)
    client.on("message", (topic, payload) => {
        console.log("Received Message:", topic, payload.toString());
        mainWindow.webContents.send("mqtt", payload.toString());
    });
    ipcMain.on("getSystemInfo", (event, data) => {
        machineId(true).then((id) => {
            mainWindow.webContents.send("getSystemInfo", id);
        });
    });
    let tray = null;
    app.whenReady().then(() => {
        tray = new Tray(path.join(__dirname, "tray.png"));
        const contextMenu = Menu.buildFromTemplate([
            {label: "Item1", type: "radio"},
            {label: "Item2", type: "radio"},
            {label: "Item3", type: "radio", checked: true},
            {label: "Item4", type: "radio"},
        ]);
        tray.setToolTip("This is my application.");
        tray.setContextMenu(contextMenu);
    });
    const {session} = require("electron");

    // Modify the user agent for all requests to the following urls.
    const filter = {
        urls: [
            "https://*.weixin.qq.com/*",
            "https://*.brinishness.top/*",
            "*://electron.github.io/*",
        ],
    };

    session.defaultSession.webRequest.onBeforeSendHeaders(
        filter,
        (details, callback) => {
            details.requestHeaders["User-Agent"] = "MyAgent";
            console.log(details);
            const urlObj = new URL(details.url);
            const {searchParams} = urlObj;
            console.log(searchParams);
            if (searchParams.get("code")) {
                let env = process.env.NODE_ENV;
                console.log(process.env);

                if (env == "development") {
                    // 热更新监听窗口
                    mainWindow.loadURL("http://127.0.0.1:5173/#/update" + urlObj.search);
                    // 打开开发工具
                } else {
                    // 生产环境中要加载文件，打包的版本
                    // Menu.setApplicationMenu(null)
                    // 加载 index.html
                    // mainWindow.loadFile(path.resolve(__dirname, "../dist/index.html")); // 新增
                    mainWindow
                        .loadURL(
                            format({
                                pathname: path.join(__dirname, "../dist/index.html"),
                                protocol: "file:",
                                slashes: false,
                                hash: "/update" + urlObj.search,
                            })
                        )
                        .then((r) => {
                            console.log(r);
                        });
                }
                // mainWindow.webContents.send("login", searchParams);
            }
            // window.location.href = '/update'
            callback({requestHeaders: details.requestHeaders});
        }
    );
    app.on("activate", function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
        // 打开的窗口，那么程序会重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
// app.on("before-quit", function (e) {
//     e.preventDefault();
//     dialog
//         .showMessageBox({
//             type: "info",
//             title: "提示",
//             message: "确认退出？",
//             buttons: ["确认", "取消"], //选择按钮，点击确认则下面的idx为0，取消为1
//             cancelId: 1, //这个的值是如果直接把提示框×掉返回的值，这里设置成和“取消”按钮一样的值，下面的idx也会是1
//         })
//         .then((idx) => {
//             //注意上面↑是用的then，网上好多是直接把方法做为showMessageBox的第二个参数，我的测试下不成功
//             console.log(idx);
//             if (idx.response === 1) {
//                 console.log("index==1，取消关闭");
//             } else {
//                 console.log("index==0，关闭");
//                 app.exit();
//             }
//         });
//     // if (process.platform !== 'darwin') app.quit()
// });

app.on("open-url", function (event, urlStr) {
    console.log(event);
    const urlObj = new URL(urlStr);
    const {searchParams} = urlObj;
    // BrowserWindow.getAllWindows()[0].loadURL("http://127.0.0.1:5173/#/about" + urlObj.search);

    BrowserWindow.getAllWindows()[0].loadURL(
        format({
            pathname: path.join(__dirname, "../dist/index.html"),
            protocol: "file:",
            hash: "/update" + urlObj.search,
        })
    );
});
ipcMain.on("changeTheme", (event, data) => {
    store.set("theme", data);
    nativeTheme.themeSource = store.get("theme");
    console.log(data);
});

ipcMain.on("getSource", (event, data) => {
    // 在主进程中.
    console.log(systemPreferences.getMediaAccessStatus('screen'));
    console.log(data);
    desktopCapturer.getSources({types: ['window', 'screen']}).then(async sources => {
        // for (const source of sources) {
        //     console.log(source.name);
        // if (source.name === 'windows.brinishness.eu.org') {
        //     mainWindow.webContents.send('SET_SOURCE', source.id)
        mainWindow.webContents.send('SET_SOURCE', sources)
        //     return
        // }
        // }
    })
});

function handleUrl(urlStr) {
    // myapp://?name=1&pwd=2
    const urlObj = new URL(urlStr);
    const {searchParams} = urlObj;
    console.log(urlObj.search); // -> ?name=1&pwd=2
    console.log(searchParams.get("name")); // -> 1
    console.log(searchParams.get("pwd")); // -> 2
    new Notification({
        title: "打开了url",
        body: JSON.stringify(urlStr),
    }).show();
}
