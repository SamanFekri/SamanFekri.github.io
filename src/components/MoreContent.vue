<template>
    <div  v-if="!isLoading">
        <div class="flex flex-wrap p-8 text-color-paragraph text-opacity-100" >
            <div class="w-full">
                <SectionHeader title="Personal Projects" class="mb-3"/>
                <div v-for="item, index in data.projects" :key="'pp-' + index" class="mb-4">
                    <a :href="item.link" v-if="item.link" class="hover:text-primary-blue cursor-pointer ease-linear duration-300">
                        <h2 class="font-bold text-xl">{{ item.title }}</h2>
                    </a>
                    <h2 class="font-bold text-xl" v-else>{{ item.title }}</h2>
                    <p v-html="item.text" class="text-left"></p>
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
        axios.get('./data/more.json')
            .then(response => {
                this.data = response.data;
                console.log(this.data);
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