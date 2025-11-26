<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div
      v-if="isVisible"
      :class="['fixed top-4 right-4 z-50 max-w-sm w-full rounded-lg shadow-lg p-4', variantClasses]"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <i :class="[iconClasses, 'text-xl']"></i>
        </div>
        <div class="ml-3 flex-1">
          <p v-if="title" class="font-medium" :class="textClasses">
            {{ title }}
          </p>
          <p class="mt-1 text-sm" :class="textClasses">
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button
            @click="close"
            class="inline-flex rounded-md focus:outline-none focus:ring-2"
            :class="buttonClasses"
          >
            <i class="las la-times"></i>
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div
        v-if="autoClose && duration > 0"
        class="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg transition-all duration-100 linear"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  autoClose?: boolean
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  autoClose: true,
  showCloseButton: true,
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)
const progress = ref(100)
let timer: number | null = null
let progressTimer: number | null = null

const variantClasses = computed(() => {
  const variants = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
    info: 'bg-blue-50 text-blue-800',
  }
  return variants[props.type]
})

const iconClasses = computed(() => {
  const icons = {
    success: 'las la-check-circle',
    error: 'las la-exclamation-circle',
    warning: 'las la-exclamation-triangle',
    info: 'las la-info-circle',
  }
  return icons[props.type]
})

const textClasses = computed(() => {
  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }
  return textColors[props.type]
})

const buttonClasses = computed(() => {
  const buttonColors = {
    success: 'text-green-400 hover:text-green-500 focus:ring-green-500',
    error: 'text-red-400 hover:text-red-500 focus:ring-red-500',
    warning: 'text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500',
    info: 'text-blue-400 hover:text-blue-500 focus:ring-blue-500',
  }
  return buttonColors[props.type]
})

const close = () => {
  isVisible.value = false
  clearTimers()
  emit('close')
}

const clearTimers = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const startAutoClose = () => {
  if (!props.autoClose || props.duration <= 0) return

  const interval = 50 // Update progress every 50ms
  const totalSteps = props.duration / interval

  let currentStep = 0
  progressTimer = setInterval(() => {
    currentStep++
    progress.value = Math.max(0, 100 - (currentStep / totalSteps) * 100)

    if (currentStep >= totalSteps) {
      clearTimers()
      close()
    }
  }, interval)

  timer = setTimeout(() => {
    clearTimers()
    close()
  }, props.duration)
}

onMounted(() => {
  isVisible.value = true
  startAutoClose()
})

onUnmounted(() => {
  clearTimers()
})
</script>
