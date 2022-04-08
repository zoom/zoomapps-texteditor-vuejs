import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.scss';
import 'primevue/resources/primevue.min.scss';
import 'primeicons/primeicons.scss';
import 'primeflex/primeflex.scss';

const app = createApp(App);
app.use(store).use(router).use(PrimeVue).mount('#app');
