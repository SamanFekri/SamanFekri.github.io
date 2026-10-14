<template>
    <div class="flex flex-wrap justify-between">
        <div class="flex flex-wrap flex-col justify-between px-8" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);">
            <h1 ref="sectionTitle" class="text-white font-bold text-2xl my-4">{{ title }}</h1>
            <div ref="dividerTitle" class="w-16 h-1 bg-primary-blue rounded"></div>
        </div>
        <div class="hidden md:flex flex-wrap justify-around border-l border-b p-4 rounded-bl-xl h-fit bg-white bg-opacity-5 border-white border-opacity-50">
            <div v-for="(s, id) in sections" :key="`sht_${id}`" class="tab font-bold hover:cursor-pointer ease-linear duration-300 mx-4" 
             :class="{'selected': s.visible, 'not-selected': !s.visible}" :style="cssVars"
             @click="selectSection(s)">
                <TabIcon v-if="s.icon" :name="s.icon" class="mr-2"/>{{ id }}
            </div>
        </div>
        <!--mobile-->
        <div class="flex md:hidden flex-wrap justify-around w-full border-t border-white border-opacity-50 bg-primary-black fixed bottom-0 left-0 py-4 z-10">
            <div v-for="(s, id) in sections" :key="`shb_${id}`" class="tab flex flex-col items-center text-sm font-bold hover:cursor-pointer ease-linear duration-300 mx-4" 
             :class="{'selected': s.visible, 'not-selected': !s.visible}" :style="cssVars"
             @click="selectSection(s)"
             >
                <TabIcon v-if="s.icon" :name="s.icon" class="text-xl mb-1"/>{{ id  }}
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import TabIcon from './TabIcon.vue';
export default{
    components: {
        TabIcon
    },
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
            gsap.to(this.$refs.dividerTitle, {y: '-200%', duration: 0.25, ease: 'power2.in'}).then(() => {
                gsap.to(this.$refs.dividerTitle, {y: '0%', duration: 0.45, ease: 'power3.out'});
            });
            gsap.to(this.$refs.sectionTitle, {x: '-150%', duration: 0.25, ease: 'power2.in'}).then(() => {
                this.$refs.sectionTitle.innerText = newTitle;
                gsap.to(this.$refs.sectionTitle, {x: '0%', duration: 0.45, ease: 'power3.out'});
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
.tab :deep(.tab-icon) {
    transition: transform 200ms ease-out, filter 300ms ease-out;
}
/* only the active tab shows the colorful icon, the others are grey */
.not-selected :deep(.tab-icon) {
    filter: grayscale(1) brightness(1.1);
}
@media (hover: hover) {
    .tab:hover :deep(.tab-icon) {
        transform: scale(1.15);
        filter: none;
    }
}
</style>