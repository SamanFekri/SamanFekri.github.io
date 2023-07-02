<template>
    <div class="flex flex-wrap h-fit bg-white bg-opacity-5 rounded-xl border border-white border-opacity-50">
        <HeaderContent class="w-full" :title="title" :sections="sections" @select-section="selectSection"/>  
        <AboutContent class="w-full" v-if="sections.About"/>
        <ExperienceContent class="w-full" v-if="sections.Experience"/>
        <EducationContent class="w-full" v-if="sections.Education"/>
        <MoreContent class="w-full" v-if="sections.More"/>
    </div>
</template>
<script>
import HeaderContent from './HeaderContent.vue';
import AboutContent from './AboutContent.vue';
import ExperienceContent from './ExperienceContent.vue';
import EducationContent from './EducationContent.vue';
import MoreContent from './MoreContent.vue';

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
                About: true,
                Experience: false,
                Education: false,
                More: false,
            }
        }
    },
    computed: {
        title() {
            if (this.sections.About) return 'About Me';
            if (this.sections.Experience) return 'Work Experience';
            if (this.sections.Education) return 'Education';
            if (this.sections.More) return 'More';
            return 'About Me';
        }
    },
    methods: {
        selectSection(section) {
            for (const key in this.sections) {
                if (Object.hasOwnProperty.call(this.sections, key)) {
                    this.sections[key] = false;
                }
            }
            this.sections[section] = true;
        }
    }
}
</script>