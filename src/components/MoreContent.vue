<template>
    <div  v-if="!isLoading" class="bg-white bg-opacity-5 bg-primary-black">
        <div class="flex flex-wrap p-8 text-color-paragraph text-opacity-100" >
            <div class="w-full">
                <SectionHeader title="Personal Projects" class="mb-3"/>
                <div v-for="item, index in data.projects" :key="'pp-' + index" class="mb-6">
                    <div class="flex flex-wrap items-baseline gap-x-4">
                        <h2 class="font-bold text-xl text-white">{{ item.title }}</h2>
                        <a v-if="item.link" :href="item.link" target="_blank" rel="noopener" class="text-sm hover:text-primary-blue ease-out duration-200">
                            <font-awesome-icon :icon="item.linkIcon || ['fas', 'arrow-up-right-from-square']" class="mr-1"/>{{ item.linkLabel || 'Visit' }}
                        </a>
                        <a v-if="item.source" :href="item.source" target="_blank" rel="noopener" class="text-sm hover:text-primary-blue ease-out duration-200">
                            <font-awesome-icon :icon="['fab', 'github']" class="mr-1"/>Source
                        </a>
                    </div>
                    <p v-if="item.tagline" class="text-primary-blue mb-2">{{ item.tagline }}</p>
                    <p v-html="item.text" class="text-left"></p>
                    <p v-if="item.tags" class="text-sm text-white text-opacity-50 mt-2">{{ item.tags.join(' · ') }}</p>
                </div>
            </div>
            <div class="w-full">
                <SectionHeader title="Interests" class="mb-3"/>
                <ul class="list-disc list-inside">
                    <li v-for="item, index in data.interests" :key="'interest-' + index">
                        {{ item }}
                    </li>
                </ul>
            </div>
            <div class="w-full">
                <SectionHeader title="Hobbies" class="mb-3"/>
                <div class = "flex flex-wrap">
                    <span v-for="item, index in data.hobbies" :key="'hb-' + index" class="border border-white rounded p-1 m-1 border-opacity-50">
                        {{ item }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SectionHeader from './SectionHeader.vue';
import { loadData } from '../data.js'

export default{
    components: {
        SectionHeader
    },
    emits: ['loaded'],
    props: {
        primaryColor: {
            type: String,
            default: '#3a7ff5'
        }
    },
    data() {
        return {
            isLoading: true,
            data: []
        }
    },
    computed: {
        cssVars() {
            return {
                '--color': this.primaryColor
            }
        }
    },
    mounted() {
        loadData('more')
            .then(data => {
                this.data = data;
                this.isLoading = false;
                this.$nextTick(() => this.$emit('loaded'));
            })
            .catch(error => {
                console.log(error);
            })
    }
}

</script>

<style scoped>
</style>