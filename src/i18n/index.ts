import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import ht from './locales/ht'
import en from './locales/en'
import es from './locales/es'

// Get saved language from localStorage or use browser language
const savedLocale = localStorage.getItem('locale')
const browserLocale = navigator.language.split('-')[0]
const defaultLocale = savedLocale || (browserLocale === 'ht' ? 'ht' : browserLocale === 'en' ? 'en' : browserLocale === 'es' ? 'es' : 'fr')

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'fr',
    messages: {
        fr,
        ht,
        en,
        es,
    },
})

export default i18n
