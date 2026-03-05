<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/ui/Modal.vue'

const props = defineProps<{
 isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen'])

const { locale } = useI18n()

const languages = [
 { code: 'fr', name: 'Français', flag: '🇫🇷' },
 { code: 'en', name: 'English', flag: '🇺🇸' },
 { code: 'es', name: 'Español', flag: '🇪🇸' },
 { code: 'ht', name: 'Kreyòl', flag: '🇭🇹' }
]

const selectLanguage = (code: string) => {
 locale.value = code
 localStorage.setItem('locale', code)
 emit('update:isOpen', false)
}
</script>

<template>
 <Modal
 :is-open="isOpen"
 @update:is-open="val => emit('update:isOpen', val)"
 title="Choisir la langue"
 >
 <div class="grid grid-cols-1 gap-2">
 <button
 v-for="lang in languages"
 :key="lang.code"
 @click="selectLanguage(lang.code)"
 class="flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-gray-50 :bg-gray-800"
 :class="locale === lang.code ? 'border-blue-500 bg-blue-50/50 ' : 'border-gray-100 '"
 >
 <div class="flex items-center gap-3">
 <span class="text-2xl">{{ lang.flag }}</span>
 <span class="font-medium text-gray-900 ">{{ lang.name }}</span>
 </div>
 <div v-if="locale === lang.code" class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
 <i class="fas fa-check"></i>
 </div>
 </button>
 </div>
 </Modal>
</template>
