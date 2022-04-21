<script setup lang="ts">
import HelloZoom from '@/components/HelloZoom.vue';
</script>

<template>
    <div class="home">
        <img id="logo" alt="Vue logo" src="@/assets/img/logo.png" />
        <HelloZoom msg="Welcome to Your Zoom App" />
        <textarea id="text" />
    </div>
</template>

<style scoped lang="scss">
#logo {
    width: 100%;
    height: auto;
    max-width: 20vw;
}
</style>
