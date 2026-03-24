import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index"
import Vant from 'vant'
import 'amfe-flexible'

// import VConsole from 'vconsole';
//
// new VConsole();

import VueLuckyCanvas from '@lucky-canvas/vue'
createApp(App).use(VueLuckyCanvas).use(Vant).use(router).mount('#app')
