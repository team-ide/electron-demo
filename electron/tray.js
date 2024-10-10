/** 托盘 区 */

const { app, Menu, Tray } = require("electron")
const options = require("./options.js");
const { destroyAll, checkWindowHideOrShow, allWindowRefresh } = require("./window.js");
const logger = require("electron-log");
let tray = null;

const trayMenu = {
    refreshMenu: {
        id: "refreshMenu",
        label: '刷新',
        visible: true,
        enabled: true,
        click: function () {
            allWindowRefresh()
        },
    },
    stopServerMenu: {
        id: "stopServerMenu",
        label: '关闭服务',
        visible: false,
        enabled: true,
        click: function () {
            stopServer()
        },
    },
    startServerMenu: {
        id: "startServerMenu",
        label: '启动服务',
        visible: false,
        enabled: true,
        click: function () {
            restartServer()
        },
    },
    restartServerMenu: {
        id: "restartServerMenu",
        label: '重启服务',
        visible: false,
        enabled: true,
        click: function () {
            restartServer()
        },
    },
    updaterMenu: {
        id: "updaterMenu",
        label: '检查更新',
        visible: true,
        enabled: true,
        click: function () {
            toAppUpdater()
        },
    },
    quitMenu: {
        id: "quitMenu",
        label: '退出',
        visible: true,
        enabled: true,
        click: function () {
            destroyAll()
        },
    },
}


const trayContextMenu = Menu.buildFromTemplate([
    trayMenu.refreshMenu,
    trayMenu.startServerMenu,
    trayMenu.stopServerMenu,
    trayMenu.restartServerMenu,
    trayMenu.updaterMenu,
    trayMenu.quitMenu,
])

const getTrayMenuItemById = (id) => {
    if (trayContextMenu == null) {
        return null
    }
    let find = null
    trayContextMenu.items.forEach((one) => {
        if (one.id == id) {
            find = one
        }
    })
    return find
}



let trayImage = ""
if (process.platform === 'darwin') {
    trayImage = (options.icon16Path)
} else {
    trayImage = (options.icon64Path)
}

app.on('ready', async () => {
    logger.info("on app ready init tray")
    tray = new Tray(trayImage)

    tray.setToolTip(options.tray.toolTip)
    if (process.platform === `darwin`) {
        //显示程序页面
        tray.on('mouse-up', () => {
            checkWindowHideOrShow()
        })
    } else {
        //显示程序页面
        tray.on('click', () => {
            checkWindowHideOrShow()
        })
    }


    tray.setContextMenu(trayContextMenu)

})
module.exports = {
    trayContextMenu,
    getTrayMenuItemById,
    trayMenu,
}