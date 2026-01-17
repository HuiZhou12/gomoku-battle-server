import app from "./utils/app";
import ElementPlus from 'element-plus' //引入element-plus ,详细配置: https://element-plus.org/zh-CN/guide/quickstart.html
import 'element-plus/dist/index.css'
import router from "./router/index"; //引入vue-router,详细配置: https://router.vuejs.org/zh/
import * as getApis from './api/http';
import { createPinia } from "pinia";

const pinia = createPinia()

//绑定全局属性
app.config.globalProperties.$http = getApis //将所有的api方法绑定到全局属性$http上,这样在任何组件中都可以通过this.$http.方法名来调用;
//全局启动相关功能的地方,包括挂载
app.use(ElementPlus).use(router).use(pinia).mount('#app');

function shouldBlockUnload() {
  return /^\/game\/[^/]+$/.test(location.pathname);
}
function handler(e) {
  e.preventDefault();
  e.returnValue = '';
}
window.addEventListener('beforeunload', (e) => {
  if (shouldBlockUnload()) {
    handler(e);
  }
});
