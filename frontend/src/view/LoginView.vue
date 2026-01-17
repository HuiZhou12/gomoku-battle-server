<template>
  <div class="login-container" :class="{ 'alert-mode': isAlert }">
    
    <div class="matrix-bg">
      <div class="grid-floor"></div>
      <div class="particles">
        <span v-for="i in 25" :key="i" :style="getParticleStyle(i)"></span>
      </div>
      <div class="vignette"></div>
    </div>

    <div class="main-card glass-panel intro-anim">
      
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>

      <div class="visual-side">
        <div class="reactor-container">
          <div class="reactor-ring outer"></div>
          <div class="reactor-ring inner"></div>
          <div class="reactor-core">
            <div class="hexagon"></div>
          </div>
        </div>
        
        <div class="title-group">
          <h2 class="game-title">
            战术五子棋
            <span class="title-en">TACTICAL CHESS</span>
          </h2>
          <div class="typewriter">
            <span class="sub-text">
              >> {{ isAlert ? '警告：检测到外部扫描 // WARNING' : '系统初始化完成 // SYSTEM READY' }}
            </span>
          </div>
        </div>

        <div class="system-logs">
          <p>SERVER: CN-01 [{{ isAlert ? '防御模式' : '正常运行' }}]</p>
          <p>ENCRYPTION: AES-256 [安全]</p>
          <p>STATUS: {{ isAlert ? '拦截中...' : '等待指挥官接入...' }}</p>
        </div>
      </div>

      <div class="form-side">
        <div class="form-header">
          <h3>{{ isLoginMode ? '身份验证' : '新兵入列' }} <span class="header-en">{{ isLoginMode ? '// LOGIN' : '// REGISTRY' }}</span></h3>
          <div class="header-line"></div>
          <p class="mode-desc">
            {{ isLoginMode ? '请输入安全凭证以连接至指挥中枢' : '正在建立新的战术指挥官档案' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <NeonInput 
            v-model="form.email" 
            label="战术邮箱 // EMAIL ID"
            :validator="emailValidator"
            icon="mail"
          />

          <NeonInput 
            v-model="form.password" 
            label="安全密钥 // PASSWORD"
            type="password"
            :validator="passwordValidator"
            icon="lock"
          />
          
          <button type="submit" class="cyber-btn" :class="{ 'loading': isLoading }">
            <div class="btn-content">
              <span class="btn-text">{{ isLoginMode ? '接入系统' : '确认档案' }}</span>
              <span class="btn-decor">{{ isLoginMode ? 'ENTER' : 'CONFIRM' }} >></span>
            </div>
            <div class="scan-light"></div>
          </button>
        </form>

        <div class="footer-action">
          <div class="switch-mode" @click="toggleMode">
            <span class="hint">{{ isLoginMode ? "尚未获取权限？" : "已有指挥官身份？" }}</span>
            <span class="link">{{ isLoginMode ? "申请入列" : "返回登录" }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="system-footer">
      <div class="footer-item">
        <span>系统版本 V1.0.0</span>
      </div>
      
      <a href="https://github.com/your-username/tactical-chess" target="_blank" class="footer-item github-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="github-icon"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        <span>OPEN SOURCE // PROJECT</span>
      </a>

      <div class="footer-item">
         <span>MIT LICENSE</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import NeonInput from '../components/NeonInput.vue';
import store from '../store/index';
import { useCyberNotify } from '../composables/useCyberNotify';

const { notify } = useCyberNotify();
const { proxy } = getCurrentInstance(); 
const accountInfoStore = store.accountInfoStore();
const router = useRouter();

const isLoginMode = ref(true);
const isLoading = ref(false); 
const isAlert = ref(false); // 控制红色警戒模式

const form = reactive({ email: '', password: '' });
let alertTimer = null;

const getParticleStyle = (i) => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    // 增加一点不透明度变化范围，让粒子更明显一点点
    opacity: 0.2 + Math.random() * 0.6 
  }
}

//环境氛围循环逻辑 
const startAtmosphereLoop = () => {
  const triggerAlert = () => {
    // 随机时间间隔：10秒 到 25秒之间
    const nextTime = Math.random() * 15000 + 10000;
    alertTimer = setTimeout(() => {
      // 触发警报
      isAlert.value = true;
      // 持续 5到6秒 后恢复
      setTimeout(() => {
        isAlert.value = false;
        triggerAlert(); // 递归调用，准备下一次
      }, 5500); 
      
    }, nextTime);
  };
  triggerAlert();
};

onMounted(() => {
  startAtmosphereLoop();
});

onUnmounted(() => {
  if(alertTimer) clearTimeout(alertTimer);
});

const toggleMode = () => {
  const card = document.querySelector('.form-side');
  card.style.opacity = '0';
  setTimeout(() => {
    isLoginMode.value = !isLoginMode.value;
    form.password = ''; 
    card.style.opacity = '1';
  }, 200);
}

const handleSubmit = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if(isLoginMode.value){
      const res = await proxy.$http.login(form.email, form.password);
      if(res.code === 200){
          notify('身份验证通过 // ACCESS GRANTED', 'success');
          accountInfoStore.loginSuccess(res.data.userinfo, res.data.token);
          setTimeout(() => router.push('/home'), 800);
      } else {
        notify('拒绝访问 // ' + (res.message || '凭证无效'), 'error');
        isLoading.value = false;
      }
    } else {
      const res = await proxy.$http.register(form.email, form.password);
      if (res.code === 200) {
        notify('档案已建立 // DOSSIER CREATED', 'success');
        isLoginMode.value = true;
        form.password = '';
        isLoading.value = false;
      } else {
        notify('注册失败 // ' + (res.message || '系统驳回'), 'error');
        isLoading.value = false;
      }
    }
  } catch (e) {
    isLoading.value = false;
    notify('系统错误 // SYSTEM ERROR', 'error');
  }
};

const emailValidator = (v) => !v ? '请输入邮箱' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '格式不正确' : '');
const passwordValidator = (v) => !v ? '请输入密钥' : (v.length < 6 ? '长度不足 6 位' : '');
</script>

<style scoped>
/* === CSS 变量定义：控制全局色调 === */
.login-container {
  /* 默认状态：冷静蓝/紫 */
  --main-color: #00f3ff;       /* 青色 */
  --sec-color: #bc13fe;        /* 紫色 */
  --bg-color: #050510;         /* 深蓝黑背景 */
  --grid-color: rgba(0, 243, 255, 0.15); /* 稍微调亮了默认网格 */
  --glow-color: rgba(0, 243, 255, 0.5);
  
  /* 丝滑过渡：所有颜色变化持续 2.5秒 */
  transition: --main-color 2.5s, --sec-color 2.5s, background-color 2.5s; 
}

/* 红色警戒状态：压迫红/暗红 */
.login-container.alert-mode {
  --main-color: #ff0f39;       /* 鲜红 */
  --sec-color: #ff5e00;        /* 橙红 */
  --bg-color: #1a0505;         /* 微微泛红的深黑背景 */
  --grid-color: rgba(255, 15, 57, 0.2);
  --glow-color: rgba(255, 15, 57, 0.6);
}

/* 容器使用变量 */
.login-container {
  height: 100vh; width: 100vw;
  display: flex; justify-content: center; align-items: center;
  background-color: var(--bg-color); /* 背景色随状态变 */
  color: #fff;
  position: relative; overflow: hidden;
  font-family: 'Rajdhani', 'Microsoft YaHei', sans-serif;
  transition: background-color 2.5s ease;
}

/* ... 核心布局样式 (大部分不变，只是替换颜色为变量) ... */
.matrix-bg { position: absolute; inset: 0; perspective: 1000px; z-index: 0; }
.grid-floor {
  position: absolute; width: 200%; height: 200%; top: -50%; left: -50%;
  /* 使用变量，并且调亮了透明度 */
  background-image: linear-gradient(var(--grid-color) 1px, transparent 1px),
                    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: rotateX(60deg) translateY(0);
  animation: grid-move 20s linear infinite;
  mask-image: radial-gradient(circle, #000 0%, transparent 65%); /* 稍微扩大可见范围 */
  transition: background-image 2.5s ease; /* 确保网格颜色丝滑过渡 */
}
.particles span {
  position: absolute; width: 2px; height: 2px; 
  background: var(--main-color); /* 粒子变色 */
  box-shadow: 0 0 5px var(--main-color);
  border-radius: 50%;
  animation: float-particle 10s infinite linear;
  transition: background 2.5s, box-shadow 2.5s;
}
.vignette { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, var(--bg-color) 100%); transition: background 2.5s; }

.main-card {
  display: flex; width: 900px; height: 500px;
  background: rgba(15, 15, 30, 0.7); /* 稍微增加不透明度，提升质感 */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1); /* 边框中性化，依靠角标体现颜色 */
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.9);
  position: relative; z-index: 10;
  clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
}

.corner { position: absolute; width: 20px; height: 20px; border: 2px solid var(--main-color); opacity: 0.5; transition: 0.3s, border-color 2.5s; }
.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }
.main-card:hover .corner { width: 30px; height: 30px; opacity: 1; box-shadow: 0 0 10px var(--main-color); }

/* 左侧 */
.visual-side {
  flex: 0.45; background: rgba(0, 0, 0, 0.2);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative; overflow: hidden;
}

.reactor-container { position: relative; width: 120px; height: 120px; margin-bottom: 40px; display: flex; justify-content: center; align-items: center; }
.reactor-ring { position: absolute; border-radius: 50%; border: 2px solid transparent; transition: border-color 2.5s; }
.outer { width: 100%; height: 100%; border-top: 2px solid var(--main-color); border-bottom: 2px solid var(--main-color); animation: spin 4s linear infinite; }
.inner { width: 70%; height: 70%; border-left: 2px solid var(--sec-color); border-right: 2px solid var(--sec-color); animation: spin-reverse 3s linear infinite; }
.reactor-core { 
  width: 40%; height: 40%; 
  background: var(--main-color); 
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); 
  animation: pulse-core 2s ease-in-out infinite; 
  box-shadow: 0 0 20px var(--main-color);
  transition: background 2.5s, box-shadow 2.5s; 
}

.title-group { text-align: center; z-index: 2; display: flex; flex-direction: column; gap: 5px; }
.game-title { 
  font-size: 36px; font-weight: 900; margin: 0; letter-spacing: 4px; color: #fff;
  text-shadow: 0 0 10px var(--glow-color);
  transition: text-shadow 2.5s;
  display: flex; flex-direction: column; align-items: center;
}
.title-en { font-size: 14px; letter-spacing: 6px; color: rgba(255,255,255,0.6); margin-top: 5px; font-family: 'Rajdhani', sans-serif; font-weight: normal; }

.sub-text { font-family: monospace; color: var(--main-color); font-size: 12px; letter-spacing: 1px; animation: blink 1s step-end infinite; transition: color 2.5s; }
.system-logs {
  position: absolute; bottom: 20px; left: 20px; 
  font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.6;
  text-align: left;
}

/* 右侧表单 */
.form-side { flex: 0.55; padding: 50px; display: flex; flex-direction: column; justify-content: center; transition: opacity 0.2s; }
.form-header h3 { font-size: 26px; font-weight: 700; letter-spacing: 2px; margin-bottom: 5px; color: #fff; display: flex; align-items: baseline; gap: 10px; }
.header-en { font-size: 14px; color: var(--sec-color); font-family: monospace; opacity: 0.8; transition: color 2.5s; }
.header-line { width: 50px; height: 3px; background: var(--sec-color); margin-bottom: 15px; transition: background 2.5s; }
.mode-desc { font-size: 13px; color: #888; margin-bottom: 30px; letter-spacing: 1px; }

.auth-form { display: flex; flex-direction: column; gap: 24px; }

/* 按钮样式使用变量 */
.cyber-btn {
  position: relative; margin-top: 10px; padding: 16px; border: none; background: transparent;
  cursor: pointer; overflow: hidden;
}
.cyber-btn::before {
  content: ''; position: absolute; inset: 0; 
  background: linear-gradient(90deg, var(--main-color), var(--sec-color)); /* 渐变色跟随状态 */
  opacity: 0.2; transform: skewX(-20deg); transition: 0.3s, background 2.5s;
}
.cyber-btn:hover::before { opacity: 0.4; transform: skewX(-20deg) scale(1.05); }
.cyber-btn::after {
  content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; 
  background: var(--main-color);
  box-shadow: 0 0 10px var(--main-color);
  transition: background 2.5s, box-shadow 2.5s;
}
.btn-content { position: relative; display: flex; justify-content: space-between; align-items: center; z-index: 2; color: #fff; }
.btn-text { font-size: 18px; font-weight: bold; letter-spacing: 4px; }
.btn-decor { font-size: 12px; font-family: monospace; opacity: 0.7; letter-spacing: 1px; }

.scan-light {
  position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-20deg); transition: 0.5s;
}
.cyber-btn:hover .scan-light { left: 200%; transition: 0.5s; }

.footer-action { margin-top: 30px; text-align: center; }
.switch-mode { cursor: pointer; display: inline-flex; gap: 10px; font-size: 13px; transition: 0.3s; padding: 6px 12px; border: 1px solid transparent; }
.switch-mode:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
.hint { color: #666; }
.link { color: var(--main-color); font-weight: bold; letter-spacing: 1px; transition: color 2.5s; }

/* 底部系统栏：增加 GitHub 和版权 */
.system-footer { 
  position: absolute; bottom: 20px; width: 100%; 
  text-align: center; color: rgba(255,255,255,0.2); 
  font-size: 12px; letter-spacing: 1px; z-index: 5; 
  display: flex; justify-content: center; align-items: center; gap: 40px; 
  font-family: monospace; 
}
.footer-item { display: flex; align-items: center; gap: 8px; transition: color 0.3s; }

/* GitHub 链接特殊样式 */
.github-link { 
  text-decoration: none; color: rgba(255,255,255,0.2); 
  cursor: pointer; padding: 5px 10px; border-radius: 4px;
}
.github-link:hover { color: var(--main-color); background: rgba(255,255,255,0.05); }
.github-icon { width: 16px; height: 16px; }

/* 动画部分保持不变 */
.intro-anim { animation: fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes grid-move { 0% { transform: rotateX(60deg) translateY(0); } 100% { transform: rotateX(60deg) translateY(50px); } }
@keyframes float-particle { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-100px); opacity: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-reverse { to { transform: rotate(-360deg); } }
@keyframes pulse-core { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.8); opacity: 0.7; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

@media (max-width: 900px) {
  .main-card { width: 95%; height: auto; flex-direction: column; }
  .visual-side { padding: 40px 20px; border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
  .form-side { padding: 30px; }
  .system-footer { flex-direction: column; gap: 10px; bottom: 10px; }
}
</style>