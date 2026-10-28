<template>
    <div class="flex flex-wrap justify-between">
        <div class="flex flex-wrap flex-col justify-between px-4 md:px-8" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);">
            <h1 ref="sectionTitle" class="text-white font-bold text-2xl my-4">{{ title }}</h1>
            <div ref="dividerTitle" class="w-16 h-1 bg-primary-blue rounded"></div>
        </div>
        <!--desktop: same look as before, but real buttons so the keyboard and screen readers can use them-->
        <div class="hidden md:flex flex-wrap justify-around border-l border-b p-4 rounded-bl-xl h-fit bg-white bg-opacity-5 border-white border-opacity-50" role="tablist" aria-label="Sections">
            <button v-for="(s, id) in sections" :key="`sht_${id}`" type="button" role="tab" :aria-selected="s.visible ? 'true' : 'false'"
             class="tab font-bold hover:cursor-pointer ease-linear duration-300 mx-4 rounded-md"
             :class="{'selected': s.visible, 'not-selected': !s.visible}" :style="cssVars"
             @click="selectSection(s)">
                <TabIcon v-if="s.icon" :name="s.icon" class="mr-2"/>{{ id }}
            </button>
        </div>
        <!--mobile: a floating liquid glass capsule, a lighter pill slides behind the selected tab-->
        <nav class="glass-bar flex md:hidden fixed z-10 left-3 right-3 p-1 rounded-full" role="tablist" aria-label="Sections">
            <span class="glass-pill" aria-hidden="true" :style="{ width: `calc((100% - 8px) / ${sectionCount})`, transform: `translateX(${selectedIndex * 100}%)` }"></span>
            <button v-for="(s, id) in sections" :key="`shb_${id}`" type="button" role="tab" :aria-selected="s.visible ? 'true' : 'false'"
             class="tab relative flex-1 flex flex-col items-center justify-center min-h-[48px] rounded-full text-[0.75rem] font-semibold leading-tight hover:cursor-pointer ease-linear duration-300"
             :class="{'selected': s.visible, 'not-selected': !s.visible}" :style="cssVars"
             @click="selectSection(s)">
                <TabIcon v-if="s.icon" :name="s.icon" class="text-[0.85rem] mb-0.5"/>{{ id }}
            </button>
        </nav>
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
        sectionCount() {
            return Object.keys(this.sections).length;
        },
        selectedIndex() {
            return Math.max(Object.values(this.sections).findIndex(s => s.visible), 0);
        },
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
@media (hover: hover) {
    .not-selected:hover {
        color: #ffffff4d;
    }
}
.tab {
    -webkit-tap-highlight-color: transparent;
}
.tab:focus-visible {
    outline: 2px solid var(--color);
    outline-offset: 3px;
}
/* liquid glass: frosted, a little see-through, a light edge on top and a soft shadow so it floats */
.glass-bar {
    bottom: calc(12px + env(safe-area-inset-bottom));
    background: rgb(40 40 46 / 0.5);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgb(255 255 255 / 0.14);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.18), 0 10px 30px rgb(0 0 0 / 0.45);
}
.glass-pill {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    border-radius: 9999px;
    background: rgb(255 255 255 / 0.12);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.16);
    transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1);
}
/* no blur support, or the visitor asked for less transparency: a solid bar */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .glass-bar {
        background: rgb(34 34 38 / 0.96);
    }
}
@media (prefers-reduced-transparency: reduce) {
    .glass-bar {
        background: #26262a;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }
}
@media (prefers-reduced-motion: reduce) {
    .glass-pill {
        transition: none;
    }
}
.tab :deep(.tab-icon) {
    transition: transform 200ms ease-out, filter 300ms ease-out;
}
/* only the active tab shows the colorful icon, the others are grey */
.not-selected :deep(.tab-icon) {
    filter: grayscale(1) brightness(1.1);
}
/* only the active tab's icon keeps moving, the others play once and rest until hovered */
.not-selected :deep(.tab-icon *) {
    animation-iteration-count: 1;
}
@media (hover: hover) {
    .tab:hover :deep(.tab-icon) {
        transform: scale(1.15);
        filter: none;
    }
    .tab:hover :deep(.tab-icon *) {
        animation-iteration-count: infinite;
    }
}
</style>