// 结构使用
const { app } = require("electron")
const { getRootPath, getAssetPath } = require("./util.js");
const { } = require("./menu.js");
const { } = require("./tray.js");
const options = require("./options.js");
const { startMainWindow, mainWindowOptions, destroyAll } = require("./window.js");
const logger = require("electron-log");

logger.info("rootPath", getRootPath("./"))
logger.info("assetPath", getAssetPath("./"))

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true' //取消警告
// 忽略https证书相关错误，加在electron相关js文件里，有app的地方
app.commandLine.appendSwitch('ignore-certificate-errors')



/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    logger.info("on window all closed")
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (mainWindowOptions.hideWhenStart || mainWindowOptions.hideWhenClose) {
        return
    }
    if (process.platform !== 'darwin') {
        destroyAll()
    }
});

app.whenReady()
    .then(() => {
        logger.info("on app ready")
        startMainWindow();
        app.on('activate', () => {
            logger.info("on app activate")
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            startMainWindow();
        });
    })
    .catch(logger.error);


// 只有显式调用quit才退出系统，区分MAC系统程序坞退出和点击X关闭退出
app.on('before-quit', () => {
    logger.info('before-quit');
    options.willQuitApp = true
    destroyAll()
});
