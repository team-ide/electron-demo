const config = {
    tray: {
        toolTip: "Electron · Demo",
    },
    window: {
        title: "Electron · Demo",
        width: 1440,
        height: 900,
        // 首页地址 如：./assets/html/index.html 或 http://127.0.0.1:8080/xxx
        index: "",
        // 使用 服务 控制台 输出的地址
        // 服务 控制台 输出 地址格式 如：electron:serverUrl:http://127.0.0.1:8080/xxx
        useServerConsoleUrl: true,
        // 服务 控制台 输出 前缀
        serverConsoleUrlPrefix: "electron:serverUrl:",
        // 开启 关闭窗口 最小化
        hideWhenClose: true,
        // 开启 启动最小化
        hideWhenStart: false,
        // 最大化
        maximize: false,
        // 全屏
        fullScreen: false,
        // 单独 给不同的 系统 配置
        // darwin 操作系统
        darwin: {

        },
        // linux 操作系统
        linux: {
        },
        // windows 操作系统
        win: {
            // 是否 显示头部
            frame: false,
        },
    },
    // 服务配置
    server: {
        // 服务根目录
        dir: "./assets/server",
        // darwin 系统服务配置
        darwin: {
            amd64: {
                libDir: "",
                exec: "./server",
                args: ["-isElectron", "1"],
            },
            arm64: {
                libDir: "",
                exec: "./server",
                args: ["-isElectron", "1"],
            },
        },
        // linux 系统服务配置
        linux: {
            amd64: {
                libDir: "",
                exec: "./server",
                args: ["-isElectron", "1"],
            },
            arm64: {
                libDir: "",
                exec: "./server",
                args: ["-isElectron", "1"],
            },
        },
        // win 系统服务配置
        win: {
            amd64: {
                libDir: "",
                exec: "./server",
                args: ["-isElectron", "1"],
            },
            arm64: {
                libDir: "",
                exec: "./server",
                args: ["-isElectron", "1"],
            },
        }
    },
}

module.exports = config
