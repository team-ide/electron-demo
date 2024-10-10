const { app, BrowserWindow, screen, tray } = require("electron");
const logger = require("electron-log");
const config = require("./config.js");
const options = require("./options.js");
const { updaterDestroy } = require("./updater.js");
const { startServer, stopServer } = require("./server.js");
const { resolveHtmlPath, getAssetPath } = require("./util.js");

const windowCache = {};
const cacheData = {}


const getRendererUrl = (page) => {
    let pageUrl = resolveHtmlPath('index.html')
    if (page != null && page != "") {
        pageUrl += "#" + page
    }
    return pageUrl
}


const getPageUrl = (page) => {
    let pageUrl = null
    if (page == null || page == "") {
        pageUrl = getRendererUrl("")
    } else {
        if (page.indexOf("http") == 0) {
            pageUrl = page
        } else {
            pageUrl = `file://${getAssetPath(page)}`
        }
    }

    return pageUrl
}


let mainWindowReadyde = false

let mainWindow = null;
const mainWindowOptions = config.window || {};
mainWindowOptions.show = false;
if (options.isWindows && config.window.win) {
    Object.assign(mainWindowOptions, config.window.win)
}
if (options.isLinux && config.window.linux) {
    Object.assign(mainWindowOptions, config.window.linux)
}
if (options.isDarwin && config.window.darwin) {
    Object.assign(mainWindowOptions, config.window.darwin)
}
mainWindowOptions.isMain = true
mainWindowOptions.key = options.mainKey;
const startMainWindow = async () => {
    if (mainWindow != null && !mainWindow.isDestroyed()) {
        mainWindow.show()
        return
    }
    logger.info("start main window")

    newWindow(mainWindowOptions);
    mainWindow = getWindow()

    let toPageUrl = ""

    if (mainWindowOptions.useServerConsoleUrl) {
        toPageUrl = getRendererUrl("/server")
    } else {
        toPageUrl = getPageUrl(mainWindowOptions.index)
    }
    mainWindow.loadURL(toPageUrl);

    if (mainWindowOptions.maximize) {
        mainWindow.maximize()
    }
    if (mainWindowOptions.fullScreen) {
        mainWindow.setFullScreen(true)
    }

    mainWindow.on('ready-to-show', () => {
        logger.info("main window ready-to-show")
        if (mainWindowReadyde) {
            return
        }
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        mainWindowReadyde = true
        if (mainWindowOptions.hideWhenStart) {
            logger.info("main window hide when start")
            allWindowHide()
        } else {
            mainWindow.show();
        }
        startServer()
    });

    mainWindow.on('close', (e) => {
        if (options.willQuitApp) {
            return
        }
        e.preventDefault();
        logger.info("main window close")

        // 如果 开启关闭最小化 则 隐藏窗口 
        if (mainWindowOptions.hideWhenClose) {
            logger.info("main window hide when close")
            allWindowHide()
        } else {
            logger.info("main window close destroy all")
            destroyAll()
        }
    });

};
let windowIndex = 0


// BrowserWindow option
// width整数（可选） - 窗口的宽度（以像素为单位）。默认是800。
// height整数（可选） - 窗口的高度（以像素为单位）。默认是600。
// x整数（可选）（如果使用y，则为必需） - 窗口的左偏移屏幕。默认是将窗口居中。
// y整数（可选）（如果使用x，则为必需） - 窗口与屏幕的偏移量。默认是将窗口居中。
// useContentSize布尔（可选） - width和height将用作网页的大小，这意味着实际窗口的大小将包括窗口框架的大小并略大。默认是false。
// center 布尔（可选） - 在屏幕中心显示窗口。
// minWidth整数（可选） - 窗口的最小宽度。默认是0。
// minHeight整数（可选） - 窗口的最小高度。默认是0。
// maxWidth整数（可选） - 窗口的最大宽度。默认是没有限制的。
// maxHeight整数（可选） - 窗口的最大高度。默认是没有限制的。
// resizable布尔（可选） - 窗口是否可调整大小。默认是true。
// movable布尔（可选） - 窗口是否可移动。这在Linux上没有实现。默认是true。
// minimizable布尔（可选） - 窗口是否可以最小化。这在Linux上没有实现。默认是true。
// maximizable布尔（可选） - 窗口是否可以最大化。这在Linux上没有实现。默认是true。
// closable布尔（可选） - 窗口是否可关闭。这在Linux上没有实现。默认是true。
// focusable布尔（可选） - 窗口是否可以聚焦。默认是true。在Windows上设置focusable: false也意味着设置skipTaskbar: true。在Linux设置下focusable: false，窗口停止与wm进行交互，所以窗口将始终保持在所有工作区的顶部。
// alwaysOnTop布尔（可选） - 窗口是否应始终保持在其他窗口之上。默认是false。
// fullscreen布尔（可选） - 窗口是否应以全屏显示。当明确设置为false全屏按钮时，将在macOS上隐藏或禁用。默认是false。
// fullscreenable布尔（可选） - 窗口是否可以进入全屏模式。在macOS上，最大化/缩放按钮是否应该切换全屏模式或最大化窗口。默认是true。
// skipTaskbar布尔（可选） - 是否在任务栏中显示窗口。默认是false。
// kiosk布尔（可选） - 自助服务终端模式。默认是false。
// title字符串（可选） - 默认窗口标题。默认是"Electron"。
// icon（NativeImage |字符串）（可选） - 窗口图标。在Windows上，建议使用ICO图标来获得最佳的视觉效果，您也可以将其保留为未定义的，以便使用可执行文件的图标。
// show布尔（可选） - 创建时是否显示窗口。默认是true。
// frame布尔（可选） - 指定false创建一个无框窗口。默认是true。
// parentBrowserWindow（可选） - 指定父窗口。默认是null。
// modal布尔（可选） - 是否是模态窗口。这只适用于窗口是子窗口的情况。默认是false。
// acceptFirstMouseBoolean（可选） - Web视图是否接受同时激活窗口的单个鼠标按下事件。默认是false。
// disableAutoHideCursor布尔（可选） - 是否在键入时隐藏光标。默认是false。
// autoHideMenuBar布尔（可选） - 除非Alt按下键，否则自动隐藏菜单栏。默认是false。
// enableLargerThanScreen布尔（可选） - 使窗口的调整大小大于屏幕。默认是false。
// backgroundColor字符串（可选） - 窗口的背景颜色为十六进制值，如#66CD00or #FFF或#80FFFFFF（支持alpha）。默认是#FFF（白色）。
// hasShadow布尔（可选） - 窗口是否应该有阴影。这只在macOS上实现。默认是true。
// darkTheme布尔（可选） - 强制使用黑暗主题作为窗口，仅适用于某些GTK + 3桌面环境。默认是false。
// transparent布尔（可选） - 使窗口透明。默认是false。
// type字符串（可选） - 窗口的类型，默认为正常窗口。请参阅下面的更多信息。
// titleBarStyle字符串（可选） - 窗口标题栏的样式。默认是default。可能的值是：
// default - 导致标准灰色不透明的Mac标题栏。
// hidden - 导致隐藏标题栏和全尺寸内容窗口，但标题栏仍然在左上角具有标准窗口控件（“交通信号灯”）。
// hidden-inset- 弃用，hiddenInset改为使用。
// hiddenInset - 在隐藏的标题栏中显示交通灯按钮稍微偏离窗口边缘的替代外观。
// customButtonsOnHover布尔（可选） - 在macOS无框窗口上绘制自定义关闭，最小化和全屏按钮。这些按钮不会显示，除非在窗口的左上角悬停。这些自定义按钮可防止与标准窗口工具栏按钮发生的鼠标事件相关的问题。注意：此选项目前是实验性的。

const newWindow = (opt) => {
    windowIndex++
    let windowKey = opt.key || ('' + windowIndex)

    let cacheKey = null;
    if (opt.cacheKey && opt.cacheData) {
        cacheKey = opt.cacheKey
        logger.info("cacheData set cacheKey:", cacheKey)
        cacheData[cacheKey] = opt.cacheData
    }
    if (opt.show == undefined) {
        opt.show = true
    }
    if (opt.title == undefined) {
        opt.title = true
    }
    if (opt.icon == undefined) {
        opt.icon = options.iconPath
    }
    if (opt.autoHideMenuBar == undefined) {
        opt.autoHideMenuBar = true
    }
    if (opt.webPreferences == undefined) {
        opt.webPreferences = {
            // 开始使用node
            nodeIntegration: true,
            // 不开启上下隔离（如果想使用require就要这个关闭）
            contextIsolation: true,
            // 关闭web安全策略，允许加载本地资源
            webSecurity: false,
            // 可以便用remote方法
            enableRemoteModule: false,
            preload: options.getRootPath('electron/preload.js')
        }
    }


    //获取到屏幕的宽度和高度
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize
    options.screenWidth = workAreaSize.width;
    options.screenHeight = workAreaSize.height;

    if (opt.width == undefined) {
        opt.width = options.screenWidth
    }
    if (opt.height == undefined) {
        opt.height = options.screenHeight
    }
    if (opt.width > options.screenWidth) {
        opt.width = (options.screenWidth - 40);
    }
    if (opt.height > options.screenHeight) {
        opt.height = (options.screenHeight - 40);
    }

    let win = new BrowserWindow(opt);
    attachTitlebarToWindow(win);
    if (opt.isMainChild) {
        win.setParentWindow(mainWindow)
    }
    if (opt.parentKey && windowCache[opt.parentKey]) {
        win.setParentWindow(windowCache[opt.parentKey])
    }

    windowCache[windowKey] = win
    if (!opt.isMain) {

        if (opt.url) {
            win.loadURL(opt.url);
        }

        win.on('ready-to-show', () => {
            if (!win) {
                throw new Error('"win" is not defined');
            }
            win.show()
            if (opt.title) {
                win.setTitle(opt.title)
            }
        });

        win.on('close', (e) => {
            destroyWindow(windowKey)
            if (cacheKey != null) {
                log.info("cacheData delete cacheKey:", cacheKey)
                delete cacheData[cacheKey]
            }
            if (opt.listenKeys) {
                opt.listenKeys.forEach((listenKey) => {
                    log.info("listenData delete listenKey:", listenKey)
                    let es = listenEvents[listenKey]
                    delete listenEvents[listenKey]
                    if (es) {
                        es.forEach((e) => {
                            e.reply('ipc-example', ['on-listen', listenKey]);
                        })
                    }
                })
            }
        });
    }
    return windowKey;
};
const showWindow = (key) => {
    let win = getWindow(key)
    if (win != null) {
        win.show()
    }
};
const getWindow = (key) => {
    key = key || options.mainKey
    let win = windowCache[key]
    if (win == null) {
        return null;
    }
    if (win.isDestroyed()) {
        delete windowCache[key]
        return null;
    }
    return win;
};
const hideWindow = (key) => {
    let win = getWindow(key)
    if (win != null) {
        win.hide()
    }
};
const destroyWindow = (key) => {
    let win = getWindow(key)
    if (win != null) {
        win.destroy()
    }
    delete windowCache[key];
};

const refreshWindow = (key) => {
    let win = getWindow(key)
    if (win != null) {
        win.reload()
    }
}
let isAllWindowHide = false;
const getAllWindows = () => {
    let viewWindowList = []
    for (let key in windowCache) {
        viewWindowList.push(windowCache[key])
    }
    return viewWindowList
};
const allWindowShow = async () => {
    isAllWindowHide = false;
    getAllWindows().forEach((one) => {
        if (!one.isDestroyed()) {
            one.show();
        }
    })
};
const allWindowHide = () => {
    isAllWindowHide = true;
    getAllWindows().forEach((one) => {
        if (!one.isDestroyed()) {
            one.hide();
        }
    })

};
const allWindowDestroy = () => {
    getAllWindows().forEach((one) => {
        if (!one.isDestroyed()) {
            one.destroy();
        }
    })
    Object.keys(windowCache).forEach(function (prop) {
        delete windowCache[prop];
    });
};

const allWindowRefresh = () => {
    let list = getAllWindows()
    list.forEach(one => {
        if (one != null && !one.isDestroyed()) {
            one.reload()
        }
    })
}

const checkWindowHideOrShow = () => {
    if (isAllWindowHide) {
        allWindowShow();
    } else {
        allWindowHide();
    }
}
const attachTitlebarToWindow = (browserWindow) => {

    browserWindow.on('enter-full-screen', () => {
        browserWindow.webContents.send('window-fullscreen', true)
    })

    browserWindow.on('leave-full-screen', () => {
        browserWindow.webContents.send('window-fullscreen', false)
    })

    browserWindow.on('focus', () => {
        browserWindow.webContents.send('window-focus', true)
    })

    browserWindow.on('blur', () => {
        browserWindow.webContents.send('window-focus', false)
    })

    browserWindow.on('maximize', () => {
        browserWindow.webContents.send('window-maximize', true)
    })

    browserWindow.on('unmaximize', () => {
        browserWindow.webContents.send('window-maximize', false)
    })
    browserWindow.on('show', () => {
        browserWindow.webContents.send('window-show', false)
    })
}



const developmentToolsOptions = {
    mode: "detach",
    activate: true,
};
const toggleDevelopmentTools = (win) => {
    win = win || BrowserWindow.getFocusedWindow()
    logger.info("toggleDevelopmentTools win:", win)
    if (win && win.webContents) {
        const webContents = win.webContents;
        if (webContents.isDevToolsOpened()) {
            webContents.closeDevTools();
        } else {
            webContents.openDevTools(developmentToolsOptions);
        }
    }
}

let destroyAllEd = false

const destroyAll = () => {
    if (destroyAllEd) {
        return
    }
    destroyAllEd = true
    logger.info("destroy all start")
    options.isStopped = true
    try {
        allWindowDestroy()
    } catch (error) {
        logger.error("all window error:", error)
    }
    try {
        stopServer()
    } catch (error) {
        logger.error("stop server error:", error)
    }
    try {
        if (tray != null) {
            tray.destroy()
        }
    } catch (error) {
        logger.error("tray destroy error:", error)
    }
    try {
        updaterDestroy()
    } catch (error) {
        logger.error("updater destroy error:", error)
    }

    try {
        if (app != null) {
            app.quit()
        }
    } catch (error) {
        logger.error("app quit error:", error)
    }
    logger.info("destroy all end")
}

module.exports = {
    startMainWindow,
    getWindow,
    showWindow,
    hideWindow,
    destroyWindow,
    refreshWindow,
    allWindowShow,
    allWindowHide,
    allWindowDestroy,
    allWindowRefresh,
    checkWindowHideOrShow,
    toggleDevelopmentTools,
    mainWindowOptions,
    destroyAll,
}
