import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    message: string
    title?: string
    type: ToastType
    duration: number
}

export interface ModalOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
    type?: 'info' | 'warning' | 'danger'
}

export const useUiStore = defineStore('ui', () => {
    const toasts = ref<Toast[]>([])
    const modal = ref<ModalOptions | null>(null)

    const showToast = (message: string, type: ToastType = 'info', title?: string, duration: number = 5000) => {
        const id = Date.now().toString()
        toasts.value.push({ id, message, title, type, duration })
    }

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const confirm = (options: ModalOptions) => {
        modal.value = options
    }

    const closeConfirm = () => {
        modal.value = null
    }

    return {
        toasts,
        modal,
        showToast,
        removeToast,
        confirm,
        closeConfirm
    }
})
