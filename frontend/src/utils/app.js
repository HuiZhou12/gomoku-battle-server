//vue默认的main.js文件中的内容移至此处
import { createApp } from 'vue'
import App from '@/App.vue'
//创建应用实例--app
const app = createApp(App);

//暴露app
export default app;