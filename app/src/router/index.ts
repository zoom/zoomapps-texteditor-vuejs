import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/meeting',
        name: 'meeting',
        component: () =>
            import(/* webpackChunkName: "meeting" */ '@/views/Meeting.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
