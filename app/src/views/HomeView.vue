<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloZoom msg="Welcome to Your Vue.js + TypeScript App" />
        test
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloZoom from '@/components/HelloZoom.vue'; // @ is an alias to /src

export default defineComponent({
    name: 'HomeView',
    components: {
        HelloZoom,
    },
});
</script>
