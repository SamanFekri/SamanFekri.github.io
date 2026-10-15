<template>
    <!--only loaded while developing (npm run dev): pick any theme, or a date to see which theme it gets-->
    <div class="fixed z-40 left-2 bottom-20 md:bottom-2 bg-black bg-opacity-80 text-white text-xs rounded p-2 flex flex-col gap-1">
        <span class="font-bold">Theme preview (dev only)</span>
        <select :value="theme" class="bg-neutral-800 rounded px-1 py-0.5" @change="$emit('update:theme', $event.target.value)">
            <option value="">Automatic (by date)</option>
            <option v-for="id in themes" :key="id" :value="id">{{ id }}</option>
        </select>
        <input :value="date" type="date" class="bg-neutral-800 rounded px-1 py-0.5" :disabled="!!theme" title="pretend today is this date"
            @input="$emit('update:date', $event.target.value)">
        <span class="opacity-70">showing: {{ showing }}</span>
    </div>
</template>

<script>
export default {
    props: {
        theme: { type: String, default: '' },
        date: { type: String, default: '' },
        themes: { type: Array, required: true },
        showing: { type: String, default: '' }
    },
    emits: ['update:theme', 'update:date']
}
</script>
