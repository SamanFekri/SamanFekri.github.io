<template>
    <div class="flex flex-wrap h-fit ">
        <HeaderContent class="w-full bg-white bg-opacity-5 bg-primary-black rounded-t-xl border-t border-r border-l border-white border-opacity-50" :title="title" :sections="sections" @select-section="selectSection"/>  
        <div class="w-full" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);">
            <AboutContent :ref="sections.About.id" class="section-content" v-if="sections.About.visible"/>
            <ExperienceContent :ref="sections.Experience.id" class="section-content" v-if="sections.Experience.visible"/>
            <EducationContent :ref="sections.Education.id" class="section-content" v-if="sections.Education.visible"/>
            <MoreContent  :ref="sections.More.id" class="section-content" v-if="sections.More.visible"/>
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
        selectSection(section) {
            // if the section is already visible, do nothing
            if (section.visible) return;
            // find all visible sections and animate them out sections is an object
            const allVisibleSections = Object.values(this.sections).filter(s => s.visible);
            // get the sections from ref and their id
            allVisibleSections.forEach(s => {
                const tempSection = this.$refs[s.id].$el;
                gsap.to(tempSection, {y: '-98%', duration: 0.5, ease: 'linear'});
            });
            // after 0.5s, set the current section to visible
            setTimeout(() => {
                section.visible = true;
                allVisibleSections.forEach(s => {
                    s.visible = false;
                });
                setTimeout(() => {
                    try {
                        gsap.to(this.$refs[section.id].$el, {y: '0', duration: 0.75, ease: 'linear'});
                    } catch (error) {
                        console.log(error);
                        setTimeout(() => {
                            gsap.to(this.$refs[section.id].$el, {y: '0', duration: 0.75, ease: 'linear'});
                        }, 500);
                    }
                }, 500);
            }, 500);
        }
    },
    mounted() {
        document.body.classList.add('bg-primary-black')
        const allVisibleSections = Object.values(this.sections).filter(s => s.visible);
        allVisibleSections.forEach(s => {
            setTimeout(() => {
                try {
                    const tempSection = this.$refs[s.id].$el;
                    gsap.to(tempSection, {y: '0', duration: 1, ease: 'linear'});
                } catch (error) {
                    console.log(error);
                    setTimeout(() => {
                        const tempSection = this.$refs[s.id].$el;
                        gsap.to(tempSection, {y: '0', duration: 1, ease: 'linear'});
                    }, 1000);
                }

            }, 500);
        });
    }, 
    // After view init, animate the sections in

}
</script>
<style scoped>
.section-content {
    @apply w-full -translate-y-[98%] rounded-b-xl border-b border-r border-l border-white border-opacity-50;
}
</style>