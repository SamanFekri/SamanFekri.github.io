<template>
    <div class="flex flex-wrap h-fit bg-white bg-opacity-0 mt-4 text-xl	border-b border-white border-opacity-50">
        <h2 class="text-white font-bold"> {{ title }}</h2>
    </div>
</template>
<script>
export default {
    props:{
        title :{
            type: String,
            required: true,
        }
    }
}
</script>