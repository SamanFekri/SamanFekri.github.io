<template>
    <div  v-if="!isLoading" class="bg-white bg-opacity-5 bg-primary-black">
        <div class="flex flex-wrap p-4 md:p-8 text-color-paragraph text-opacity-100" >
            <div v-for="item, index in data" :key="'edu-' + index" class="mb-4">
                <h2 class="font-bold text-xl">{{ item.title }}</h2>
                <h3 class="text-lg mb-2">
                    <span class="font-bold text-white mr-2" >
                        <a class="hover:text-primary-blue cursor-pointer ease-linear duration-300" :href="item.link" v-if="item.link" target="_blank">{{ item.field }}</a>
                        <span v-else> {{ item.field }}</span>
                    </span> | 
                    <span class="mx-2 text-base">
                        <font-awesome-icon :icon='["fas", "calendar"]' class="mr-2"/>
                        <span>{{ item.date }}</span>
                    </span> |
                    <span class="mx-2 text-base">
                        <font-awesome-icon :icon='["fas", "map-marker-alt"]' class="mr-2"/>
                        <span>{{ item.location }}</span>
                    </span>
                </h3>
                <p v-html="item.text" class="text-left"></p>
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
        loadData('education')
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