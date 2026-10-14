<template>
    <div class="flex flex-wrap h-fit ">
        <HeaderContent class="w-full bg-white bg-opacity-5 bg-primary-black rounded-t-xl border-t border-r border-l border-white border-opacity-50" :title="title" :sections="sections" @select-section="selectSection"/>  
        <div class="w-full" style="clip-path: inset(0 -4px -4px -4px);">
            <AboutContent :ref="sections.About.id" class="section-content" v-if="sections.About.visible" @loaded="slideIn(sections.About)"/>
            <ExperienceContent :ref="sections.Experience.id" class="section-content" v-if="sections.Experience.visible" @loaded="slideIn(sections.Experience)"/>
            <EducationContent :ref="sections.Education.id" class="section-content" v-if="sections.Education.visible" @loaded="slideIn(sections.Education)"/>
            <MoreContent  :ref="sections.More.id" class="section-content" v-if="sections.More.visible" @loaded="slideIn(sections.More)"/>
        </div>
    </div>
</template>
<script>
import HeaderContent from './HeaderContent.vue';
import AboutContent from './AboutContent.vue';
import ExperienceContent from './ExperienceContent.vue';
import EducationContent from './EducationContent.vue';
import MoreContent from './MoreContent.vue';
import { gsap } from 'gsap';

export default {
    components: {
        HeaderContent,
        AboutContent,
        ExperienceContent,
        EducationContent,
        MoreContent
    },
    data() {
        return {
            sections: {
                About: { id: 'about', title: 'About Me', visible: true},
                Experience: { id: 'experience', title: 'Work Experience', visible: false},
                Education: { id: 'education', title: 'Education', visible: false},
                More: { id: 'more', title: 'More', visible: false}
            }
        }
    },
    computed: {
        title() {
            // find the section that is visible from sections and return its title
            for (const key in this.sections) {
                if (Object.hasOwnProperty.call(this.sections, key)) {
                    if (this.sections[key].visible) return this.sections[key].title;
                }
            }
            return '';
        }
    },
    methods: {
        slideIn(section) {
            // called once the section has loaded its data and rendered its real element
            gsap.to(this.$refs[section.id].$el, {y: '0', duration: 0.6, ease: 'power3.out'});
        },
        selectSection(section) {
            // if the section is already visible, do nothing
            if (section.visible) return;
            // find all visible sections and animate them out sections is an object
            const allVisibleSections = Object.values(this.sections).filter(s => s.visible);
            // get the sections from ref and their id
            allVisibleSections.forEach(s => {
                const tempSection = this.$refs[s.id].$el;
                gsap.to(tempSection, {y: '-98%', duration: 0.3, ease: 'power2.in'});
            });
            // after 0.3s, set the current section to visible, it slides in from slideIn when loaded
            setTimeout(() => {
                section.visible = true;
                allVisibleSections.forEach(s => {
                    s.visible = false;
                });
            }, 300);
        }
    },
    mounted() {
        document.body.classList.add('bg-primary-black')
    }
}
</script>
<style scoped>
.section-content {
    @apply w-full -translate-y-[98%] rounded-b-xl border-b border-r border-l border-white border-opacity-50;
}
</style>