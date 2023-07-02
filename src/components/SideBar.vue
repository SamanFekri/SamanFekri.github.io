<template>
    <div class="flex flex-wrap justify-center item-aligns h-fit bg-white bg-opacity-5 p-4 rounded-xl border border-white border-opacity-50 mb-4">
        <BorderGradiantBox border-radius="50%" class="w-full p-2 hover:cursor-pointer overflow-hidden pic" @click="nextProfilePic" :style="cssVars">
            <img :src="profilePics[profilePicIndex]"/>
        </BorderGradiantBox>
        <div class="w-full text-center text-white">
            <h1 class="text-2xl font-bold">{{name}}</h1>
        </div>
        <div class="w-full flex justify-center text-center text-white mt-2 mb-2">
            <h1 class="text-sm px-4 py-1 bg-white bg-opacity-10 rounded-lg">{{bio}}</h1>
        </div>
        <div class="w-full border-t mx-4 my-4 border-white border-opacity-50"> </div>
        <div class="w-full my-4">
            <!--for loop over the data id is the index of it-->
            <PersonalData v-for="(item, id) in data" :key="`pd_${id}`"
                :icon="item.icon"
                :title="item.title"
                :text="item.text"
                :uri="item.uri"
                :color="primaryBlue"
            />
        </div>
        <div class="flex flex-wrap justify-center items-center w-full mb-4">
            <!--link for each brand in socialMedia with its icon-->
            <a v-for="(item, id) in socialMedia" :key="`sm_${id}`" target="_blank" :href="item.link" class="w-6 h-6 m-1">
                <font-awesome-icon :icon="item.icon" class="w-full h-full text-white opacity-50 hover:opacity-100 ease-linear duration-300"/>
            </a>
        </div>
        <a class="w-full text-center flex justify-center" :href="cta.link" target="_blank">
            <BorderGradiantBox border-radius="15px" class="w-10/12" :center-color="primaryBlue">
                <div class="w-full h-full flex justify-center items-center text-lg p-4 text-white opacity-50 hover:opacity-100 ease-linear duration-300 card_bg">
                    <font-awesome-icon :icon="cta.icon" />
                    <span class="ml-2">{{ cta.text }}</span>
                </div>
            </BorderGradiantBox>
        </a>
    </div>
</template>

<script>
import BorderGradiantBox from './BorderGradiantBox.vue';
import PersonalData from './PersonalData.vue';
import axios from 'axios'

export default{
    components:{
        BorderGradiantBox,
        PersonalData
    },
    data() {
        return {
            profilePics: [],
            profilePicIndex: 0,
            profilePicDegree: 0,
            primaryBlue: '#3a7ff5',
            primaryBlack: '#181818',
            primaryWhite: '#f3f3f3',
            bio: '',
            name: '',
            data: [],
            socialMedia: [],
            cta: {}
        }
    },
    computed: {
        cssVars() {
            return {
                '--pic-rotation': `${this.profilePicDegree}deg`,
            }
        }
    },
    methods: {
        nextProfilePic(){
            this.profilePicDegree = (this.profilePicDegree + 180) % 360 ;
            setTimeout(() => {
                this.profilePicIndex++;
                if(this.profilePicIndex >= this.profilePics.length){
                    this.profilePicIndex = 0;
                }
            }, 500);
        }
    },
    mounted() {
        axios.get('./data/personal.json')
            .then(response => {
                console.log(response.data)
                this.profilePics = response.data.pics;
                this.name = `${response.data.firstName} ${response.data.lastName}`;
                this.bio = response.data.bio;
                this.socialMedia = response.data.socialMedia;
                this.data = response.data.data;
                this.cta = response.data.cta;

                setTimeout(() => {
                    this.nextProfilePic();
                    setTimeout(() => {
                        this.nextProfilePic();
                    }, 2000);
                }, 1000);
            })
            .catch(error => {
                console.log(error)
            })
    }
}

</script>

<style scoped>
.pic {
    transform: rotateY(var(--pic-rotation));
    transform-style: preserve-3d;
    transition: all 1s ease-in-out;
}
.card_bg {
    background: linear-gradient(135deg, #3a7ff5a0, #f3f3f320,#f3f3f320);
}
</style>