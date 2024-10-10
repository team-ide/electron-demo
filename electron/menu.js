/** 头部 菜单 区 */


const { Menu } = require("electron")

// 置空 菜单
const menu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(menu);