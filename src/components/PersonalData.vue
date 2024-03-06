<template>
    <a class="flex flex-wrap items-center" :href="uri" target="_blank">
        <BorderGradiantBox :centerColor="color" class="w-12 h-12">
            <div class="flex justify-center items-center w-full h-full text-center text-lg cursor-pointer icon" :style="cssVars">
                <font-awesome-icon :icon="icon" />
            </div>
        </BorderGradiantBox>
        <div class="flex flex-wrap items-center ml-4" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);">
            <h2 ref="personalTitle" class="w-full text-xs">{{ title }}</h2>
            <p  ref="personalText" class="w-full text-base text-white">{{ text }}</p>
        </div>
    </a>
</template>

<script>
import BorderGradiantBox from './BorderGradiantBox.vue';
import { gsap } from 'gsap'


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
        },
        delay: {
            type: Number,
            default: 0
        }
    },
    computed:{
        cssVars() {
            return {
                '--color': this.color,
                '--color-opacity': `${this.color}0a`
            }
        }
    },
    mounted() {
        gsap.set(this.$refs.personalTitle, {y: '-200%'})
        gsap.set(this.$refs.personalText, {x: '-200%'})
        setTimeout(() => {
            gsap.to(this.$refs.personalTitle, {duration: 0.2, y: '0', ease: 'linear'})
            gsap.to(this.$refs.personalText, {duration: 0.5, x: '0', ease: 'linear'})

        }, this.delay)
    }
}

</script>

<style scoped>
.icon {
    background: linear-gradient(135deg, var(--color), #f3f3f30a,#f3f3f30a);
    color: var(--color);
}
</style>