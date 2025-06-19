import './assets/main.css'
import 'element-plus/es/components/message/style/css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
