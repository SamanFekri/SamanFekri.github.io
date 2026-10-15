<script setup>
import { defineAsyncComponent } from 'vue';
import SideBar from './components/SideBar.vue';
import MainContent from './components/MainContent.vue';
import SeasonalBadge from './components/SeasonalBadge.vue';
import BirthdayBalloons from './components/BirthdayBalloons.vue';

// the preview panel only exists in development (npm run dev), the production build leaves it out
const ThemePreview = import.meta.env.DEV ? defineAsyncComponent(() => import('./components/ThemePreview.vue')) : null;
</script>

<template>
    <div class="flex flex-wrap justify-around w-full h-full max-w-7xl pb-16 md:pb-0">
      <SideBar class="w-full md:w-3/12"/>
      <MainContent class="w-full md:w-8/12"/>
      <SeasonalBadge/>
      <BirthdayBalloons/>
      <component :is="ThemePreview" v-if="ThemePreview"/>
    </div>
</template>

<style scoped>
</style>
