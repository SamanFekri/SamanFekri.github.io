<template>
    <!--shows the current time of day and weather of the location as a small animated scene, each weather code has its own look-->
    <div v-if="weather" class="relative group">
        <svg class="weather absolute left-0 bottom-4 w-[32px] h-[32px]" viewBox="0 0 32 32" role="img" :aria-label="summary">
            <!--stars only at night when the sky is visible-->
            <g v-if="!weather.isDay && scene.sky" fill="#ffe8a3">
                <path class="star star-1" d="M5 4 l0.6 1.4 l1.4 0.6 l-1.4 0.6 l-0.6 1.4 l-0.6 -1.4 l-1.4 -0.6 l1.4 -0.6 z"/>
                <path class="star star-2" d="M27 9 l0.5 1.1 l1.1 0.5 l-1.1 0.5 l-0.5 1.1 l-0.5 -1.1 l-1.1 -0.5 l1.1 -0.5 z"/>
                <circle class="star star-3" cx="24" cy="3.5" r="0.7"/>
            </g>
            <!--sun or moon: full, half behind a cloud, or peeking out for showers-->
            <g v-if="scene.sky" :transform="skyTransform">
                <g v-if="weather.isDay">
                    <g class="rays" stroke="#ffd166" stroke-width="2" stroke-linecap="round">
                        <path d="M16 3.5 v3 M16 25.5 v3 M3.5 16 h3 M25.5 16 h3 M7.2 7.2 l2.1 2.1 M22.7 22.7 l2.1 2.1 M7.2 24.8 l2.1 -2.1 M22.7 9.3 l2.1 -2.1"/>
                    </g>
                    <circle cx="16" cy="16" r="6" fill="#ffc72c"/>
                </g>
                <path v-else class="moon" d="M18 6.5 a9.5 9.5 0 1 0 7.5 15.2 a7.6 7.6 0 1 1 -7.5 -15.2 z" fill="#f5e6a8"/>
            </g>
            <!--clouds-->
            <g v-if="scene.cloud === 'small'" transform="translate(14 9) scale(0.55)">
                <path class="cloud pass" :d="cloudPath" :fill="colors.front"/>
            </g>
            <g v-if="scene.cloud === 'overcast' || scene.cloud === 'storm'" transform="translate(-4 -6) scale(0.85)">
                <path class="cloud cloud-back" :d="cloudPath" :fill="colors.back"/>
            </g>
            <path v-if="scene.cloud && scene.cloud !== 'small'" class="cloud" :d="cloudPath" :fill="colors.front"/>
            <!--an ice crystal marks freezing drizzle and freezing rain-->
            <path v-if="scene.freezing" class="crystal" d="M23 14.2 v4.8 M20.9 15.4 l4.2 2.4 M20.9 17.8 l4.2 -2.4" stroke="#bfefff" stroke-width="0.9" stroke-linecap="round"/>
            <!--falling drizzle, rain, snow, snow grains or hail, the count shows how strong it is-->
            <template v-for="(p, i) in particles" :key="'p-' + i">
                <path v-if="scene.fall === 'rain'" class="rain" :d="`M${p.x} ${p.y} l-0.8 2.6`" :stroke="fallColor" stroke-width="1.6" stroke-linecap="round" :style="p.style"/>
                <circle v-else :class="scene.fall" :cx="p.x" :cy="p.y" :r="fallRadius" :fill="fallColor" :stroke="scene.fall === 'hail' ? '#93c5fd' : 'none'" stroke-width="0.4" :style="p.style"/>
            </template>
            <polygon v-if="scene.thunder" class="bolt" points="17.5,22 13.5,27.6 16.4,27.6 14.6,31.6 20,25.6 17,25.6 19,22" fill="#ffd166"/>
            <!--fog lines, rime fog also gets frost crystals-->
            <g v-if="scene.fog" stroke="#d1d5db" stroke-width="1.6" stroke-linecap="round">
                <path v-for="i in scene.fog" :key="'fog-' + i" class="mist" :class="{ 'mist-reverse': i % 2 === 0 }" :d="fogLine(i)"/>
            </g>
            <g v-if="scene.rime" stroke="#bfefff" stroke-width="0.8" stroke-linecap="round">
                <path class="crystal" d="M7 4 v4.4 M5.1 5.1 l3.8 2.2 M5.1 7.3 l3.8 -2.2"/>
                <path class="crystal crystal-late" d="M25 23.4 v4.4 M23.1 24.5 l3.8 2.2 M23.1 26.7 l3.8 -2.2"/>
            </g>
        </svg>
        <span class="absolute left-0 bottom-[7px] w-[32px] text-center text-[0.6rem] font-bold leading-none text-white text-opacity-80 tabular-nums">{{ localTime }}</span>
        <div class="absolute left-0 bottom-12 bg-black bg-opacity-80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {{ summary }}
            <span class="flex items-center text-[0.5rem] text-blue-400">Weather data by Open-Meteo.com</span>
        </div>
    </div>
</template>

<script>
// every weather code open-meteo (WMO) can send and how it is drawn
// sky: full | behind | peek, cloud: small | normal | overcast | storm, fall: drizzle | rain | snow | grain | hail, count: how many drops
const SCENES = {
    0: { label: 'Clear sky', sky: 'full' },
    1: { label: 'Mainly clear', sky: 'full', cloud: 'small' },
    2: { label: 'Partly cloudy', sky: 'behind', cloud: 'normal' },
    3: { label: 'Overcast', cloud: 'overcast' },
    45: { label: 'Fog', cloud: 'normal', fog: 2 },
    48: { label: 'Rime fog', fog: 3, rime: true },
    51: { label: 'Light drizzle', cloud: 'normal', fall: 'drizzle', count: 2 },
    53: { label: 'Drizzle', cloud: 'normal', fall: 'drizzle', count: 4 },
    55: { label: 'Dense drizzle', cloud: 'overcast', fall: 'drizzle', count: 6 },
    56: { label: 'Light freezing drizzle', cloud: 'normal', fall: 'drizzle', count: 2, freezing: true },
    57: { label: 'Dense freezing drizzle', cloud: 'overcast', fall: 'drizzle', count: 6, freezing: true },
    61: { label: 'Light rain', cloud: 'normal', fall: 'rain', count: 2 },
    63: { label: 'Rain', cloud: 'normal', fall: 'rain', count: 4 },
    65: { label: 'Heavy rain', cloud: 'storm', fall: 'rain', count: 6, heavy: true },
    66: { label: 'Light freezing rain', cloud: 'normal', fall: 'rain', count: 2, freezing: true },
    67: { label: 'Heavy freezing rain', cloud: 'storm', fall: 'rain', count: 6, freezing: true, heavy: true },
    71: { label: 'Light snow', cloud: 'normal', fall: 'snow', count: 2 },
    73: { label: 'Snow', cloud: 'normal', fall: 'snow', count: 4 },
    75: { label: 'Heavy snow', cloud: 'overcast', fall: 'snow', count: 6, heavy: true },
    77: { label: 'Snow grains', cloud: 'normal', fall: 'grain', count: 7 },
    80: { label: 'Light rain showers', sky: 'peek', cloud: 'normal', fall: 'rain', count: 2 },
    81: { label: 'Rain showers', sky: 'peek', cloud: 'normal', fall: 'rain', count: 4 },
    82: { label: 'Violent rain showers', sky: 'peek', cloud: 'storm', fall: 'rain', count: 6, heavy: true },
    85: { label: 'Light snow showers', sky: 'peek', cloud: 'normal', fall: 'snow', count: 2 },
    86: { label: 'Heavy snow showers', sky: 'peek', cloud: 'overcast', fall: 'snow', count: 6, heavy: true },
    95: { label: 'Thunderstorm', cloud: 'storm', fall: 'rain', count: 3, thunder: true },
    96: { label: 'Thunderstorm with light hail', cloud: 'storm', fall: 'hail', count: 2, thunder: true },
    99: { label: 'Thunderstorm with heavy hail', cloud: 'storm', fall: 'hail', count: 5, thunder: true }
};
// seconds for one drop to fall
const DURATIONS = { drizzle: 1.5, rain: 0.9, snow: 2.2, grain: 1.8, hail: 1.4 };
const RADIUS = { drizzle: 0.75, snow: 1.1, grain: 0.45, hail: 1.1 };

export default {
    props: {
        // the location as written on the page, like "Milan, Italy"
        location: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            place: null,
            weather: null,
            now: new Date(),
            clockTimer: null,
            weatherTimer: null,
            cloudPath: 'M9.5 24 a4 4 0 0 1 -0.4 -7.98 a6 6 0 0 1 11.5 -1.8 a4.5 4.5 0 0 1 3.9 9.78 z'
        }
    },
    computed: {
        scene() {
            // unknown codes fall back to overcast
            return SCENES[this.weather.code] || SCENES[3];
        },
        skyTransform() {
            if (this.scene.sky === 'behind') return 'translate(-4 -4)';
            if (this.scene.sky === 'peek') return 'translate(-6 -7) scale(0.8)';
            return null;
        },
        colors() {
            const storm = this.scene.cloud === 'storm';
            if (this.weather.isDay) return storm ? { front: '#9aa3ae', back: '#6b7480' } : { front: '#eef1f5', back: '#c3cad4' };
            return storm ? { front: '#7a838f', back: '#4b525c' } : { front: '#a7b0bd', back: '#6b7480' };
        },
        fallColor() {
            if (this.scene.freezing) return '#bfefff';
            return { drizzle: '#9fd3ff', rain: '#7cc4ff', snow: '#ffffff', grain: '#ffffff', hail: '#e0f2fe' }[this.scene.fall];
        },
        fallRadius() {
            return RADIUS[this.scene.fall];
        },
        particles() {
            const { fall, count, heavy } = this.scene;
            if (!fall) return [];
            // heavy weather falls faster
            const duration = DURATIONS[fall] * (heavy ? 0.65 : 1);
            return Array.from({ length: count }, (_, i) => ({
                x: (10 + 12 * (i + 0.5) / count).toFixed(1),
                y: 25.5 + (i % 2) * 1.2,
                style: { animationDuration: `${duration}s`, animationDelay: `${-(duration * i / count).toFixed(2)}s` }
            }));
        },
        localTime() {
            return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: this.place.timezone }).format(this.now);
        },
        summary() {
            return `${this.place.name} · ${this.localTime} · ${Math.round(this.weather.temperature)}°C · ${this.scene.label}`;
        }
    },
    methods: {
        fogLine(i) {
            // under the cloud for fog, across the whole icon for rime fog
            if (this.scene.cloud) return `M${6 + (i % 2) * 5} ${24 + i * 3} h14`;
            return `M${4 + (i % 2) * 4} ${4 + i * 6} h20`;
        },
        async findPlace() {
            // "Milan, Italy" -> search "Milan" and prefer the result in Italy
            const [city, country] = this.location.split(',').map(s => s.trim());
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`);
            const results = (await response.json()).results || [];
            const match = results.find(r => country && r.country === country) || results[0];
            if (!match) throw new Error(`location not found: ${this.location}`);
            return { name: match.name, latitude: match.latitude, longitude: match.longitude, timezone: match.timezone };
        },
        minuteTick() {
            this.now = new Date();
            this.loadWeather();
        },
        async loadWeather() {
            try {
                if (!this.place) this.place = await this.findPlace();
                const { latitude, longitude } = this.place;
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`);
                const current = (await response.json()).current;
                this.weather = { temperature: current.temperature_2m, code: current.weather_code, isDay: current.is_day === 1 };
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.loadWeather();
        // tick exactly when the minute changes, then update the clock and the weather every minute
        const untilNextMinute = 60 * 1000 - (Date.now() % (60 * 1000));
        this.clockTimer = setTimeout(() => {
            this.minuteTick();
            this.weatherTimer = setInterval(this.minuteTick, 60 * 1000);
        }, untilNextMinute);
    },
    beforeUnmount() {
        clearTimeout(this.clockTimer);
        clearInterval(this.weatherTimer);
    }
}
</script>

<style scoped>
.weather {
    overflow: visible;
}
.weather * {
    transform-box: fill-box;
    transform-origin: center;
}
.rays {
    animation: spin 12s linear infinite;
}
.moon {
    animation: rock 4s ease-in-out infinite;
}
.star {
    animation: twinkle 1.8s ease-in-out infinite;
}
.star-2 {
    animation-delay: -0.6s;
}
.star-3 {
    animation-delay: -1.2s;
}
.cloud {
    animation: drift 4s ease-in-out infinite alternate;
}
.cloud-back {
    animation-duration: 5.5s;
    animation-direction: alternate-reverse;
}
.pass {
    animation: pass 6s ease-in-out infinite alternate;
}
.crystal {
    animation: crystal 6s linear infinite;
}
.crystal-late {
    animation-delay: -3s;
}
.rain {
    animation: fall linear infinite;
}
.drizzle {
    animation: drizzle linear infinite;
}
.snow {
    animation: snow linear infinite;
}
.grain {
    animation: grain linear infinite;
}
.hail {
    animation: hail ease-in infinite;
}
.bolt {
    animation: flash 2.6s linear infinite;
}
.mist {
    animation: drift 3s ease-in-out infinite alternate;
}
.mist-reverse {
    animation-direction: alternate-reverse;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
@keyframes rock {
    0%, 100% { transform: rotate(-8deg); }
    50% { transform: rotate(8deg); }
}
@keyframes twinkle {
    0%, 100% { transform: scale(0.4); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 1; }
}
@keyframes drift {
    from { transform: translateX(-1.5px); }
    to { transform: translateX(1.5px); }
}
@keyframes pass {
    from { transform: translateX(-6px); }
    to { transform: translateX(6px); }
}
@keyframes crystal {
    0% { transform: rotate(0) scale(0.8); opacity: 0.6; }
    50% { transform: rotate(180deg) scale(1.15); opacity: 1; }
    100% { transform: rotate(360deg) scale(0.8); opacity: 0.6; }
}
@keyframes fall {
    from { transform: translateY(-2px); opacity: 0; }
    30% { opacity: 1; }
    to { transform: translateY(4px); opacity: 0; }
}
@keyframes drizzle {
    from { transform: translateY(-1px); opacity: 0; }
    30% { opacity: 1; }
    to { transform: translateY(3px); opacity: 0; }
}
@keyframes snow {
    0% { transform: translate(0, -2px); opacity: 0; }
    30% { opacity: 1; }
    50% { transform: translate(1px, 1px); }
    100% { transform: translate(-1px, 5px); opacity: 0; }
}
@keyframes grain {
    from { transform: translateY(-1px); opacity: 0; }
    20% { opacity: 1; }
    to { transform: translateY(5px); opacity: 0; }
}
@keyframes hail {
    0% { transform: translateY(-2px); opacity: 0; }
    15% { opacity: 1; }
    55% { transform: translateY(4px); }
    70% { transform: translateY(2.2px); }
    85% { transform: translateY(4px); opacity: 1; }
    100% { transform: translateY(4px); opacity: 0; }
}
@keyframes flash {
    0%, 70%, 78%, 100% { opacity: 0; }
    72%, 76%, 82% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
    .weather * {
        animation: none !important;
    }
    .bolt {
        opacity: 1;
    }
}
</style>
