<template>
    <div class="home">
        <img id="logo" alt="Vue logo" src="../assets/logo.png" />
        <HelloZoom msg="Welcome to Your Zoom App" />
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

<style scoped lang="scss">
#logo {
    width: 100%;
    height: auto;
    max-width: 20vw;
}
</style>
