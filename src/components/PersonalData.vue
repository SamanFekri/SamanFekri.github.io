<template>
    <a class="flex flex-wrap items-center" :href="uri" target="_blank">
        <BorderGradiantBox :centerColor="color" class="w-12 h-12">
            <div class="flex justify-center items-center w-full h-full text-center text-lg cursor-pointer icon" :style="cssVars">
                <font-awesome-icon :icon="icon" />
            </div>
        </BorderGradiantBox>
        <div class="flex flex-wrap items-center ml-4">
            <h2 class="w-full text-xs">{{ title }}</h2>
            <p class="w-full text-base text-white">{{ text }}</p>
        </div>
    </a>
</template>

<script>
import BorderGradiantBox from './BorderGradiantBox.vue';


export default{
    components:{
        BorderGradiantBox,
    },
    props: {
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        uri: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#f3f3f3'
        }
    },
    computed:{
        cssVars() {
            return {
                '--color': this.color,
                '--color-opacity': `${this.color}0a`
            }
        }
    }
}

</script>

<style scoped>
.icon {
    background: linear-gradient(135deg, var(--color), #f3f3f30a,#f3f3f30a);
    color: var(--color);
}
</style>