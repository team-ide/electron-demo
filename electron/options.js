const Path = require("path")
const logger = require("electron-log");
const dotenv = require("dotenv");

var isDev = process.env.NODE_ENV == 'development'
logger.info("isDev", isDev)
dotenv.config({ path: `./.env.${isDev ? 'development' : 'production'}` })

const ROOT_PATH = isDev ? Path.join(__dirname, '../') : Path.join(process.resourcesPath, '');
const ASSETS_PATH = isDev ? Path.join(__dirname, '../assets') : Path.join(process.resourcesPath, 'assets');
const SERVER_PATH = isDev ? Path.join(__dirname, '../server') : Path.join(process.resourcesPath, 'server');

const getRootPath = (...paths) => {
    return Path.join(ROOT_PATH, ...paths);
};
const getAssetPath = (...paths) => {
    return Path.join(ASSETS_PATH, ...paths);
};

const getServerPath = (...paths) => {
    return Path.join(SERVER_PATH, ...paths);
};
const options = {
    mainKey: "main",
    tray: {
        toolTip: "Electron · Demo",
    },
    isStopped: false,
    willQuitApp: false,
    screenWidth: 1440,
    screenHeight: 900,
    isDev: isDev,
    rootDir: ROOT_PATH,
    assetsDir: ASSETS_PATH,
    servertDir: SERVER_PATH,
    isDebug: isDev || process.env.DEBUG_PROD === 'true',
    isDarwin: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    isLinux: process.platform === 'linux',
    isAmd64: process.arch === 'x64',
    isArm64: process.arch === 'arm64',
    iconPath: getAssetPath('icons/icon.png'),
    icon16Path: getAssetPath('icons/icon-16.png'),
    icon32Path: getAssetPath('icons/icon-32.png'),
    icon64Path: getAssetPath('icons/icon-64.png'),
    getRootPath,
    getAssetPath,
    getServerPath,
}

module.exports = options