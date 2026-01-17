<template>
  <div class="input-group" :class="{ error: !!error }">
    <input 
      :type="type" 
      :value="modelValue"
      @input="onInput"
      @blur="validate"
      placeholder=" " 
      class="neon-input"
    />
    <label class="floating-label">{{ label }}</label>
    <div class="highlight-bar"></div>

    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>


<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  validator: Function
});

const emit = defineEmits(['update:modelValue']);

const error = ref('');

const onInput = (e) => {
  emit('update:modelValue', e.target.value);
  if (error.value) {
    validate(); // 实时修正错误
  }
};

const validate = () => {
  if (props.validator) {
    error.value = props.validator(props.modelValue) || '';
  }
};
</script>

<style scoped>
.input-group {
  position: relative;
  margin-bottom: 24px;
  width: 100%;
}

.neon-input {
  width: 100%;
  padding: 12px 10px;
  font-size: 16px;
  background: var(--bg-input);
  border: none;
  border-bottom: 1px solid var(--text-muted);
  border-radius: 4px 4px 0 0;
  color: var(--text-main); /* 强制白色文字，解决变黑bug */
  outline: none;
  transition: all var(--transition-speed);
}

/* 浮动标签逻辑 */
.floating-label {
  position: absolute;
  top: 12px;
  left: 10px;
  font-size: 16px;
  color: var(--text-muted);
  pointer-events: none;
  transition: all 0.2s ease;
}

/* 当输入框聚焦 或 有内容时 (利用placeholder trick) */
.neon-input:focus ~ .floating-label,
.neon-input:not(:placeholder-shown) ~ .floating-label {
  top: -20px;
  left: 0;
  font-size: 12px;
  color: var(--primary);
}

/* 底部发光条动画 */
.highlight-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary);
  transition: width 0.3s ease;
}

.neon-input:focus ~ .highlight-bar {
  width: 100%;
}

/* 修正浏览器自动填充的黄色背景 */
.neon-input:-webkit-autofill,
.neon-input:-webkit-autofill:hover, 
.neon-input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--text-main);
  -webkit-box-shadow: 0 0 0px 1000px #0a0a1a inset; /* 使用深色遮盖 */
  transition: background-color 5000s ease-in-out 0s;
}

/* 1. 错误时，输入框背景泛红光，边框变红 */
.input-group.error .neon-input {
  background: rgba(255, 0, 85, 0.1); /* 淡淡的血色背景 */
  border-bottom-color: #ff0055;
  box-shadow: inset 0 0 15px rgba(255, 0, 85, 0.2); /* 内部红色发光 */
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

/* 2. 错误时，Label 变红并发出警报感 */
.input-group.error .neon-input ~ .floating-label {
  color: #ff0055;
  text-shadow: 0 0 5px rgba(255, 0, 85, 0.6);
}

/* 3. 错误时，底部条变红且全宽 */
.input-group.error .highlight-bar {
  background: #ff0055;
  box-shadow: 0 0 12px #ff0055;
  width: 100% !important; /* 强制展开 */
}

/* 4. 错误文字：做成终端日志风格 */
.error-text {
  position: absolute;
  bottom: -22px; /* 悬挂在横线下方 */
  left: 0;
  margin: 0;
  
  font-family: 'Courier New', Courier, monospace; /* 机械感字体 */
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase; /* 全大写 */
  
  color: #ff0055;
  text-shadow: 0 0 4px rgba(255, 0, 85, 0.5);
  
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 小图标样式 */
.warning-icon {
  font-size: 14px;
  animation: blink 1s infinite; /* 只有图标在闪烁 */
}
/* 错误时的剧烈抖动 */
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

/* 警报灯闪烁 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* 错误文字出现时的故障效果 */
.glitch-fade-enter-active {
  animation: glitch-in 0.3s ease-out forwards;
}
.glitch-fade-leave-active {
  transition: opacity 0.2s ease;
}
.glitch-fade-leave-to {
  opacity: 0;
}

@keyframes glitch-in {
  0% { opacity: 0; transform: translateX(-10px); }
  50% { opacity: 1; transform: translateX(5px); }
  70% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}

/* 自动填充修复 (深色遮罩) */
.neon-input:-webkit-autofill,
.neon-input:-webkit-autofill:hover, 
.neon-input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--text-main);
  -webkit-box-shadow: 0 0 0px 1000px #0a0a1a inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>