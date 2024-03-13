<template>
    <div class="flex flex-wrap justify-between">
        <div class="flex flex-wrap flex-col justify-between px-8" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);">
            <h1 ref="sectionTitle" class="text-white font-bold text-2xl my-4">{{ title }}</h1>
            <div ref="dividerTitle" class="w-16 h-1 bg-primary-blue rounded"></div>
        </div>
        <div class="hidden md:flex flex-wrap justify-around border-l border-b p-4 rounded-bl-xl h-fit bg-white bg-opacity-5 border-white border-opacity-50">
            <div v-for="(s, id) in sections" :key="`sht_${id}`" class="font-bold hover:cursor-pointer ease-linear duration-300 mx-4" 
             :class="{'selected': s.visible, 'not-selected': !s.visible}" :style="cssVars"
             @click="selectSection(s)">
                {{ id }}
            </div>
        </div>
        <!--mobile-->
        <div class="flex md:hidden flex-wrap justify-around w-full border-t border-white border-opacity-50 bg-primary-black fixed bottom-0 left-0 py-4 z-10">
            <div v-for="(s, id) in sections" :key="`shb_${id}`" class="font-bold hover:cursor-pointer ease-linear duration-300 mx-4" 
             :class="{'selected': s, 'not-selected': !s}" :style="cssVars"
             @click="selectSection(id)"
             >
                {{ id  }}
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
export default{
    props: {
        title: {
            type: String,
            required: true
        },
        sections: {
            type: Object,
            required: true
        },
        primaryColor: {
            type: String,
            default: '#3a7ff5'
        }
    },
    computed: {
        cssVars() {
            return {
                '--color': this.primaryColor
            }
        }
    },
    methods: {
        selectSection(section) {
            this.$emit('select-section', section)
        }
    },
    watch: {
        title(newTitle) {
            gsap.to(this.$refs.dividerTitle, {y: '-200%', duration: 0.3, ease: 'linear'}).then(() => {
                gsap.to(this.$refs.dividerTitle, {y: '0%', duration: 0.5, ease: 'linear'});
            });
            gsap.to(this.$refs.sectionTitle, {x: '-150%', duration: 0.3, ease: 'linear'}).then(() => {
                this.$refs.sectionTitle.innerText = newTitle;
                gsap.to(this.$refs.sectionTitle, {x: '0%', duration: 0.5, ease: 'linear'});
            });
        }
    }
}
</script>

<style scoped>
.selected {
    color: var(--color);
}

.not-selected {
    color: #ffffff9a;
}
.not-selected:hover {
    color: #ffffff4d;
}
</style>