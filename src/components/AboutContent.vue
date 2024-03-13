<template>
    <div  v-if="!isLoading" class="bg-white bg-opacity-5 bg-primary-black">
        <div class="flex flex-wrap p-8" >
            <p class="text-color-paragraph text-opacity-100 text-justify" v-html="data.summary">
            </p>
            <div class="w-full">
                <SectionHeader class="w-full" title="Skills"/>
                <!-- for item in data.skills the key: value and key is bold remove bullet points-->
                <div class="flex flex-wrap text-color-paragraph text-opacity-100">
                    <div class="w-full">
                        <ul class="list-inside">
                            <li class="my-2" v-for="item in data.skills" :key="item">
                                <span class="font-bold">{{ Object.keys(item)[0] }}:</span> {{ Object.values(item)[0] }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--loop over languages. first make section header then example 🇺🇸 English: Professional each item have name, flag, level-->
            <div class="w-full">
                <SectionHeader class="w-full" title="Languages"/>
                <div class="flex flex-wrap text-color-paragraph text-opacity-100">
                    <div class="w-full">
                        <ul class="list-inside">
                            <li class="my-2" v-for="item in data.languages" :key="item">
                                <span class="font-bold">{{ item.flag }} {{ item.name }}:</span> {{ item.level }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SectionHeader from './SectionHeader.vue';
import axios from 'axios'

export default{
    components: {
        SectionHeader
    },
    props: {
        primaryColor: {
            type: String,
            default: '#3a7ff5'
        }
    },
    data() {
        return {
            isLoading: true,
            data: {}
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
    mounted() {
        axios.get('./data/about.json')
            .then(response => {
                this.data = response.data;
                this.isLoading = false;
            })
            .catch(error => {
                console.log(error);
            })
    }
}

</script>

<style scoped>
</style>