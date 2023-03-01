<template>
  <header>

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>&nbsp;
        <RouterLink to="/about">About</RouterLink>&nbsp;
        <RouterLink to="/quill">Editor</RouterLink>&nbsp;
        <RouterLink to="/settings">Settings</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
