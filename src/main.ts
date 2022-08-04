import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

// add element-plus icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// animations
import 'animate.css';

// router
import router from './router';

// element plus
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from 'element-plus'
import ptBR from 'element-plus/es/locale/lang/pt-br'

// icons
import './icons'

// global css
import './assets/style.scss'

// add library to Vue

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .component('pt-br', ptBR)
  .use(ElementPlus, {
    locale: ptBR
  })
  
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
