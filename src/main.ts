import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

// element plus
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'
import ptBR from 'element-plus/es/locale/lang/pt-br'

// icons
import './icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
  .use(createPinia())
  .use(ElementPlus, {
    locale: ptBR
  })
  .component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
