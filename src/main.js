import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js"
import Vant from 'vant'
import 'amfe-flexible'

import VueLuckyCanvas from '@lucky-canvas/vue'
createApp(App).use(VueLuckyCanvas).use(Vant).use(router).mount('#app')
