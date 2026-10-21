<template>
    <div class="flex flex-wrap justify-center item-aligns h-fit bg-white bg-opacity-5 p-4 rounded-xl border border-white border-opacity-50 mb-4">
        <!--the circle has its full size from the start (full width, square), so nothing jumps while the picture loads-->
        <div class="relative w-4/5 md:w-full">
            <BorderGradiantBox border-radius="50%" class="w-full aspect-square p-2 hover:cursor-pointer overflow-hidden pic" @click="nextProfilePic" :style="cssVars">
                <!--the png shows right away and keeps the space, the video fades in on top only once it is really playing-->
                <div v-if="isVideo(currentPic)" class="relative w-full h-full">
                    <img :src="stillOf(currentPic)" :alt="name" class="w-full h-full object-cover" :class="{ invisible: videoReady }"/>
                    <video :src="currentPic" class="absolute inset-0 w-full h-full object-contain translate-x-2 translate-y-3 transition-opacity duration-300"
                        :class="videoReady ? 'opacity-100' : 'opacity-0'" autoplay muted loop playsinline :aria-label="name"
                        @canplay="playVideo" @playing="videoReady = true" @error="videoFailed = true"></video>
                </div>
                <img v-else-if="currentPic" :src="currentPic" :alt="name" class="w-full h-full object-cover"/>
            </BorderGradiantBox>
            <div class="relative group">
                <!-- <img src="https://moodpal.samanfekri.me/user/82768138/mood/animated" 
                    class="absolute right-0 bottom-4 hover:cursor-pointer" 
                    width="32" height="32" :alt="`${name}'s current mood`"
                /> -->
                <mood-pal src="https://moodpal.samanfekri.me/user/82768138/mood/tgs" 
                    class="absolute right-0 bottom-4 hover:cursor-pointer w-[32px] h-[32px]"></mood-pal>
                     
                <div class="absolute right-0 bottom-12 bg-black bg-opacity-80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {{ name }}'s current mood.
                    <span class="flex items-center text-[0.5rem]">
                        <a href="https://t.me/MoodPalBot" target="_blank" class="text-blue-400" >
                           <font-awesome-icon :icon="['fab', 'telegram']" />  @MoodPalBot 
                        </a>
                    </span>
                </div>
            </div>
            <!--mirror of the mood: time of day and weather of my location-->
            <WeatherBadge v-if="location" :location="location"/>
        </div>
        <div class="w-full text-center text-white">
            <!--three quick clicks on my name open the heart lock-->
            <h1 class="text-2xl font-bold select-none" @click="onNameClick">{{name}}</h1>
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
                :triple-click-event="item.title === 'Birthday' ? 'open-heart-lock' : ''"
                :color="primaryBlue"
                :delay="id * 500"
            />
        </div>
        <nav ref="navSocialMedia" class="flex flex-wrap justify-center items-center w-full mb-4">
            <!--link for each brand in socialMedia with its icon-->
            <a v-for="(item, id) in socialMedia" :key="`sm_${id}`" target="_blank" :href="item.link" class="w-6 h-6 m-1" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);">
                <font-awesome-icon :icon="item.icon" class="w-full h-full text-white opacity-50 hover:opacity-100 ease-linear duration-300 hidden"/>
            </a>
        </nav>
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
import WeatherBadge from './WeatherBadge.vue';
import axios from 'axios'
import { gsap } from 'gsap'

export default{
    components:{
        BorderGradiantBox,
        PersonalData,
        WeatherBadge
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
            cta: {},
            videoFailed: false,
            videoReady: false
        }
    },
    computed: {
        location() {
            const item = this.data.find(d => d.title === 'Location');
            return item ? item.text : '';
        },
        currentPic() {
            const pic = this.profilePics[this.profilePicIndex];
            if (!pic || !this.isVideo(pic)) return pic;
            // reduced motion, or a video that can not play, shows the still png
            if (this.videoFailed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return this.stillOf(pic);
            // safari engine can not show webm transparency, it gets the hevc with alpha .mov instead
            return this.isAppleWebKit() ? pic.replace(/\.webm$/i, '.mov') : pic;
        },
        cssVars() {
            return {
                '--pic-rotation': `${this.profilePicDegree}deg`,
            }
        }
    },
    watch: {
        currentPic() {
            this.videoReady = false;
        }
    },
    methods: {
        onNameClick() {
            this.nameClicks = (this.nameClicks || 0) + 1;
            clearTimeout(this.nameClickTimer);
            if (this.nameClicks >= 3) {
                this.nameClicks = 0;
                window.dispatchEvent(new Event('open-heart-lock'));
                return;
            }
            this.nameClickTimer = setTimeout(() => { this.nameClicks = 0; }, 600);
        },
        isVideo(pic) {
            return /\.(webm|mov)$/i.test(pic || '');
        },
        stillOf(pic) {
            return pic.replace(/\.(webm|mov)$/i, '.png');
        },
        isAppleWebKit() {
            const ua = navigator.userAgent;
            // every browser on iphone and ipad uses safari's engine, newer ipads report themselves as a mac with touch
            const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
            const isDesktopSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
            return isIOS || isDesktopSafari;
        },
        playVideo(event) {
            // autoplay can be blocked, for example in low power mode on iphone, then show the still image
            const playing = event.target.play();
            if (playing) playing.catch(() => { this.videoFailed = true; });
        },
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

                setTimeout(() => {
                    // get all svg that are in the navSocialMedia ref
                    let icons = this.$refs.navSocialMedia.getElementsByTagName('svg')
                    // for each icon set gsap to +200% in y and then animate to 0 in 0.5s
                    for (let i = 0; i < icons.length; i++) {
                        gsap.set(icons[i], {y: '200%', display: 'block'})
                        setTimeout(() => {
                            gsap.to(icons[i], {duration: 0.5, y: '0', ease: 'power3.out'})
                        }, i * 100)
                    }
                }, 1500);
                
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