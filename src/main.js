import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

app.mount('#app')

window.electron.ipcRenderer.sendMessage("ipc-example", "ping");
window.electron.ipcRenderer.on('ipc-example', (args) => {
    if (args == 'pong') {
        console.log("on pong")
    }
})