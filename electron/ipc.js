const { ipcMain } = require("electron")

ipcMain.on('ipc-example', async (event, args) => {
    var eventType = args;
    if (typeof (args) !== 'string') {
        eventType = args[0]
    }
    logger.info("on event ", eventType)
    if (eventType == 'ping') {
        event.reply('ipc-example', "pong");
        return
    }
    if (eventType == 'toggleDevelopmentTools') {
        return
    }
});