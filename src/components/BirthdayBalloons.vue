<template>
    <!--on my birthday one balloon for every year of my age floats up once and stays at the top of the screen, click one to pop it-->
    <div v-if="show" class="balloons fixed inset-0 z-[9] overflow-hidden" aria-hidden="true">
        <div v-for="(b, i) in balloons" :key="'balloon-' + i" class="arrive" :style="b.arrive">
            <div class="bob" :style="b.bob">
                <svg class="balloon" :class="{ popped: popped[i] }" :width="b.size" :height="b.size * 1.9" viewBox="0 0 40 76" @click="pop(i)">
                    <path d="M20 40 q-4 9 2 18 q5 8 -1 18" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1"/>
                    <path d="M17 39 h6 l-3 -4 z" :fill="b.color"/>
                    <ellipse cx="20" cy="19" rx="15" ry="18" :fill="b.color"/>
                    <ellipse cx="14" cy="11" rx="3.4" ry="5.4" fill="#ffffff" opacity="0.35" transform="rotate(-25 14 11)"/>
                </svg>
                <svg v-if="popped[i]" class="burst" :width="b.size" :height="b.size" viewBox="0 0 40 40">
                    <path v-for="a in 8" :key="'ray' + a" :transform="`rotate(${a * 45} 20 20)`" d="M20 8 v-6" :stroke="b.color" stroke-width="2.4" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import { isBirthday } from '../seasonal.js';
import { preview, previewDate } from '../preview.js';
import { loadData } from '../data.js';

const COLORS = ['#ff6b6b', '#ffd43b', '#4dabf7', '#51cf66', '#f783ac', '#9775fa', '#ff922b'];

export default {
    data() {
        return {
            preview,
            birthYear: null,
            popped: {},
            now: Date.now(),
            timer: null,
            isDesktop: window.matchMedia('(min-width: 768px)').matches,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }
    },
    computed: {
        show() {
            // `now` makes this check again every hour, the day can change while the page is open
            this.now;
            if (this.reducedMotion || !this.birthYear) return false;
            return this.preview.balloons || isBirthday(previewDate());
        },
        age() {
            return previewDate().getFullYear() - this.birthYear;
        },
        balloons() {
            const count = Math.max(this.age, 1);
            const base = this.isDesktop ? 40 : 28;
            // spread over the width, at a few heights so they bunch up like a real group of balloons
            return Array.from({ length: count }, (_, i) => {
                const size = Math.round(base * (0.85 + ((i * 13) % 4) * 0.08));
                return {
                    color: COLORS[i % COLORS.length],
                    size,
                    arrive: {
                        left: `${((i + 0.5) / count) * 100 + (((i * 7) % 5) - 2) * 0.6}%`,
                        top: `${4 + ((i * 37) % 5) * (this.isDesktop ? 14 : 9)}px`,
                        marginLeft: `${-size / 2}px`,
                        animationDuration: `${4.5 + (i % 5) * 0.4}s`,
                        animationDelay: `${(i * 0.15).toFixed(2)}s`
                    },
                    bob: { animationDuration: `${2.4 + (i % 4) * 0.4}s`, animationDelay: `${-(i * 0.3).toFixed(1)}s` }
                };
            });
        }
    },
    methods: {
        pop(i) {
            this.popped[i] = true;
        }
    },
    mounted() {
        // the birth year comes from the birthday on the page, "15 June 1995"
        loadData('personal').then(data => {
            const birthday = data.data.find(item => item.title === 'Birthday');
            const year = birthday && birthday.text.match(/\d{4}/);
            if (year) this.birthYear = Number(year[0]);
        }).catch(error => console.log(error));
        this.timer = setInterval(() => { this.now = Date.now(); }, 60 * 60 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    }
}
</script>

<style scoped>
/* the page under the balloons stays clickable, only the balloons themselves catch clicks */
.balloons {
    pointer-events: none;
}
/* each balloon floats up once from below the screen and stays where it arrives */
.arrive {
    position: absolute;
    animation: arrive ease-out both;
}
.bob {
    position: relative;
    animation: bob ease-in-out infinite alternate;
}
.balloon {
    pointer-events: auto;
    cursor: pointer;
    filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.3));
    transition: transform 150ms ease-out, opacity 150ms ease-out;
    -webkit-tap-highlight-color: transparent;
}
.balloon.popped {
    transform: scale(1.35);
    opacity: 0;
    pointer-events: none;
}
.burst {
    position: absolute;
    top: 0;
    left: 0;
    animation: burst 0.5s ease-out forwards;
}
@keyframes arrive {
    from { transform: translateY(calc(100vh + 100%)); }
    to { transform: translateY(0); }
}
@keyframes bob {
    from { transform: translateY(-3px) rotate(-4deg); }
    to { transform: translateY(3px) rotate(4deg); }
}
@keyframes burst {
    from { transform: scale(0.4); opacity: 1; }
    to { transform: scale(1.4); opacity: 0; }
}
</style>
