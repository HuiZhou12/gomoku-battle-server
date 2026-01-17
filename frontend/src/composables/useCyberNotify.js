// src/composables/useCyberNotify.js
import { ref } from 'vue';

// 全局状态，保证所有组件共享同一个队列
const notifications = ref([]);
let idCounter = 0;

export function useCyberNotify() {
  
  // type: 'success' | 'error' | 'warning' | 'info'
  const notify = (message, type = 'info', title = null) => {
    const id = idCounter++;
    
    // 如果没有传标题，根据类型自动补充一个看起来很酷的战术标题
    if (!title) {
      const titles = {
        success: 'OPERATION SUCCESS // 操作完成',
        error: 'cYBER SYSTEM ERROR // 系统警告',
        warning: 'SECURITY ALERT // 安全警示',
        info: 'SYSTEM LOG // 系统日志'
      };
      title = titles[type];
    }

    const newItem = { id, message, type, title };
    notifications.value.push(newItem);

    // 3秒后自动移除
    setTimeout(() => {
      remove(id);
    }, 3500);
  };

  const remove = (id) => {
    const index = notifications.value.findIndex(item => item.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  return {
    notifications,
    notify,
    remove
  };
}