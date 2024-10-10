// 该 JS 通过 窗口 `webPreferences` 引入

const { contextBridge, ipcRenderer } = require("electron")

const Channels = 'ipc-example';

const electronHandler = {
    ipcRenderer: {
        sendMessage(channel, args) {
            ipcRenderer.send(channel, args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) =>
                func(...args);
            ipcRenderer.on(channel, subscription);

            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
    },
    platform: process.platform,
};

contextBridge.exposeInMainWorld('electron', electronHandler);

// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
    // console.log("window DOMContentLoaded")
    // const replaceText = (selector, text) => {
    //     const element = document.getElementById(selector)
    //     if (element) element.innerText = text
    // }

    // for (const dependency of ['chrome', 'node', 'electron']) {
    //     replaceText(`${dependency}-version`, process.versions[dependency])
    // }
})