<script setup>
import SideBar from './components/SideBar.vue';
import MainContent from './components/MainContent.vue';

</script>

<template>
    <div class="flex flex-wrap justify-around w-full h-full max-w-7xl">
      <SideBar class="w-full md:w-3/12"/>
      <MainContent class="w-full md:w-8/12"/>
    </div>
</template>

<style scoped>
</style>
