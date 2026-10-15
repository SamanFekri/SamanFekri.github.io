<script setup>
import SideBar from './components/SideBar.vue';
import MainContent from './components/MainContent.vue';
import SeasonalBadge from './components/SeasonalBadge.vue';

</script>

<template>
    <div class="flex flex-wrap justify-around w-full h-full max-w-7xl pb-16 md:pb-0">
      <SideBar class="w-full md:w-3/12"/>
      <MainContent class="w-full md:w-8/12"/>
      <SeasonalBadge/>
    </div>
</template>

<style scoped>
</style>
