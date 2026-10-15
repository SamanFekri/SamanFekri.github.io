<template>
    <!--only loaded while developing (npm run dev): pick any theme, a date to see what it gets, or turn on the birthday balloons-->
    <div class="fixed z-40 left-2 top-2 bg-black bg-opacity-80 text-white text-xs rounded p-2 flex flex-col gap-1">
        <span class="font-bold">Preview (dev only)</span>
        <select v-model="preview.theme" class="bg-neutral-800 rounded px-1 py-0.5">
            <option value="">Automatic (by date)</option>
            <option v-for="id in themes" :key="id" :value="id">{{ id }}</option>
        </select>
        <input v-model="preview.date" type="date" class="bg-neutral-800 rounded px-1 py-0.5" title="pretend today is this date">
        <label class="flex items-center gap-1">
            <input v-model="preview.balloons" type="checkbox"> Birthday balloons
        </label>
        <span class="opacity-70">birthday on this date: {{ birthday ? 'yes' : 'no' }}</span>
    </div>
</template>

<script>
import { preview, previewDate } from '../preview.js';
import { isBirthday } from '../seasonal.js';

export default {
    data() {
        return {
            preview,
            themes: ['yalda', 'suri', 'nowruz', 'sizdah', 'easter', 'halloween', 'thanksgiving', 'christmas', 'newyear', 'epifania', 'valentine', 'stpatrick', 'spring', 'summer', 'autumn', 'winter']
        }
    },
    computed: {
        birthday() {
            this.preview.date;
            return isBirthday(previewDate());
        }
    }
}
</script>
