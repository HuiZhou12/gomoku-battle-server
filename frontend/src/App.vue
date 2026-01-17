<script setup>
  import CyberToast from './components/CyberToast.vue'
  import store from './store/index';
  import { useRouter } from 'vue-router';
  import { watch } from 'vue';
  import { useCyberNotify } from './composables/useCyberNotify'


const { notify } = useCyberNotify();  
const matchStore = store.matchStore();
const router = useRouter();

//用户登录后，如果存在未完成的对局，则跳转到该对局
watch(
  () => matchStore.needResume,
   (v) => {
    if (v) {
      router.push(`/game/${matchStore.matchId}`);
      matchStore.needResume = false;
    }
  }
);



</script>

<template>
  <CyberToast />
  <div>
    <router-view></router-view>
  </div>
  
</template>

<style>
  :root {
  --bg-deep: #050510;       
  --bg-glass: rgba(20, 20, 40, 0.6); 
  --bg-input: rgba(0, 0, 0, 0.4);    
  
  --primary: #00f3ff;       /* 霓虹青 */
  --primary-glow: rgba(0, 243, 255, 0.4);
  
  --accent: #bc13fe;        /* 电光紫 */
  
  --text-main: #ffffff;
  --text-muted: #8b9bb4;
  --border-color: rgba(255, 255, 255, 0.1);
  
  --transition-speed: 0.3s;
}

body {
  margin: 0;
  background-color: var(--bg-deep);
  color: var(--text-main);
  /* 微软雅黑和苹果字体 */
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  overflow: hidden; 
}

.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
</style>
