<template>
    <a class="flex flex-wrap items-center" :href="uri" target="_blank" @click="onClick">
        <BorderGradiantBox :centerColor="color" class="w-12 h-12">
            <div class="flex justify-center items-center w-full h-full text-center text-lg cursor-pointer icon" :style="cssVars">
                <InfoIcon v-if="animatedIcon" :name="animatedIcon"/>
                <font-awesome-icon v-else :icon="icon" />
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
import InfoIcon from './InfoIcon.vue';
import { gsap } from 'gsap'


export default{
    components:{
        BorderGradiantBox,
        InfoIcon,
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
        // when set, three quick clicks send this window event instead of opening the link
        tripleClickEvent: {
            type: String,
            default: ''
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
        // the font awesome icons from the data that have an animated version
        animatedIcon() {
            const animated = {
                'envelope': 'email',
                'mobile-button': 'phone',
                'mobile-alt': 'phone',
                'birthday-cake': 'birthday',
                'cake-candles': 'birthday',
                'map-marker-alt': 'location',
                'location-dot': 'location'
            };
            return animated[this.icon[1]] || null;
        },
        cssVars() {
            return {
                '--color': this.color,
                '--color-opacity': `${this.color}0a`
            }
        }
    },
    methods: {
        onClick(event) {
            if (!this.tripleClickEvent) return;
            // wait a moment to tell one click (open the link as usual) from three quick clicks (the secret)
            event.preventDefault();
            this.clicks = (this.clicks || 0) + 1;
            clearTimeout(this.clickTimer);
            if (this.clicks >= 3) {
                this.clicks = 0;
                window.dispatchEvent(new Event(this.tripleClickEvent));
                return;
            }
            this.clickTimer = setTimeout(() => {
                if (this.clicks === 1) {
                    const link = document.createElement('a');
                    link.href = this.uri;
                    link.target = '_blank';
                    link.click();
                }
                this.clicks = 0;
            }, 450);
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