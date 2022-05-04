import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import '@/assets/scss/main.scss';

import { ZoomSDK } from './types';
declare global {
    interface Window {
        zoomSdk: ZoomSDK;
    }
}

library.add(fas);
dom.watch();

const app = createApp(App);
app.provide('zoomSdk', window.zoomSdk);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store).use(router).mount('#app');
