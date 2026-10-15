<template>
    <!--an animated scene for the current persian event, american event or persian season,
        drawn in the curved corner piece that is left when a circle sits inside a square: stuck to the bottom right corner of the screen on desktop and the top right on mobile-->
    <div class="seasonal fixed z-30 right-0" :class="isDesktop ? 'bottom-0' : 'top-0'" :style="{ width: `${size}px`, height: `${size}px` }">
        <svg class="w-full h-full" viewBox="0 0 100 100" role="img" :aria-label="label">
            <defs>
                <clipPath id="seasonal-clip"><path :d="cornerPath"/></clipPath>
                <radialGradient id="seasonal-glow-candle"><stop offset="0" stop-color="#ffb703" stop-opacity="0.6"/><stop offset="1" stop-color="#ffb703" stop-opacity="0"/></radialGradient>
                <radialGradient id="seasonal-glow-fire"><stop offset="0" stop-color="#fd7e14" stop-opacity="0.55"/><stop offset="1" stop-color="#fd7e14" stop-opacity="0"/></radialGradient>
            </defs>
            <g class="corner" @click="open = !open" @mouseenter="hover = true" @mouseleave="hover = false">
            <path :d="cornerPath" :fill="background"/>
            <g clip-path="url(#seasonal-clip)">
            <g :transform="sceneTransform">

                <!--yalda: pomegranate, candle and stars on the longest night-->
                <g v-if="theme.id === 'yalda'">
                    <circle v-for="(s, i) in [[14, 14], [48, 10], [56, 26], [8, 30]]" :key="'ys' + i" class="twinkle" :cx="s[0]" :cy="s[1]" r="1.2" fill="#ffe8a3" :style="delay(i, 1.8)"/>
                    <circle class="glow" cx="49" cy="20" r="9" fill="url(#seasonal-glow-candle)"/>
                    <rect x="46" y="23" width="6" height="15" rx="1" fill="#f4e4c1"/>
                    <path class="flicker" d="M49 13 c3 4 3.4 7.4 0 9 c-3.4 -1.6 -3 -5 0 -9 z" fill="#ffb703"/>
                    <path d="M22 28 l1.6 -5 l2.4 3 l2.4 -3 l1.6 5 z" fill="#8e0e25"/>
                    <circle cx="26" cy="40" r="13" fill="#b3122e"/>
                    <ellipse cx="21" cy="35" rx="3.4" ry="2" fill="#ffffff" opacity="0.25"/>
                    <ellipse cx="44" cy="49" rx="11" ry="7" fill="#fbe3d0" stroke="#b3122e" stroke-width="2.2"/>
                    <circle v-for="(s, i) in [[38, 48], [42, 46], [46, 47], [50, 49], [40, 51], [44, 51], [48, 52], [44, 49]]" :key="'yp' + i" class="seed" :cx="s[0]" :cy="s[1]" r="1.5" fill="#e11d48" :style="delay(i, 2)"/>
                </g>

                <!--chaharshanbe suri: a bonfire with rising sparks-->
                <g v-else-if="theme.id === 'suri'">
                    <circle class="glow" cx="32" cy="36" r="22" fill="url(#seasonal-glow-fire)"/>
                    <circle v-for="(x, i) in [26, 32, 38, 30, 35]" :key="'ss' + i" class="spark" :cx="x" cy="24" r="1.2" fill="#ffd43b" :style="delay(i, 1.6)"/>
                    <g class="flame-group">
                        <path d="M32 12 C41 22 45 31 43 40 C41 48 23 48 21 40 C19 31 25 24 32 12 Z" fill="#e8590c"/>
                        <path class="flicker" d="M32 21 C38 28 40 34 38 41 C36 46 28 46 26 41 C24 34 27 29 32 21 Z" fill="#fd7e14"/>
                        <path class="flicker flicker-late" d="M32 29 C35.5 33 36.5 38 34.5 42 C33.5 44.5 30.5 44.5 29.5 42 C27.5 38 28.5 33 32 29 Z" fill="#ffd43b"/>
                    </g>
                    <rect x="16" y="46" width="32" height="5" rx="2.5" fill="#6b3e1f" transform="rotate(-14 32 48.5)"/>
                    <rect x="16" y="46" width="32" height="5" rx="2.5" fill="#83502a" transform="rotate(14 32 48.5)"/>
                </g>

                <!--halloween: a glowing jack-o'-lantern and a flapping bat under the moon-->
                <g v-else-if="theme.id === 'halloween'">
                    <circle cx="47" cy="16" r="7" fill="#ffe066" opacity="0.9"/>
                    <g class="bat">
                        <g class="wings" fill="#111">
                            <path d="M20 17 q-5 -5 -10 -1 q3 1 3 4 q3 -1 7 0 z"/>
                            <path d="M20 17 q5 -5 10 -1 q-3 1 -3 4 q-3 -1 -7 0 z"/>
                        </g>
                        <ellipse cx="20" cy="18" rx="2" ry="3" fill="#111"/>
                    </g>
                    <rect x="30.5" y="27" width="3" height="6" rx="1" fill="#2b8a3e"/>
                    <ellipse cx="25" cy="44" rx="9" ry="12" fill="#e8590c"/>
                    <ellipse cx="39" cy="44" rx="9" ry="12" fill="#e8590c"/>
                    <ellipse cx="32" cy="44" rx="9" ry="12.5" fill="#fd7e14"/>
                    <g class="face" fill="#ffd43b">
                        <path d="M24 39 l3.5 -4 l3.5 4 z M33 39 l3.5 -4 l3.5 4 z"/>
                        <path d="M23 46 l3 3 l3 -2 l3 2 l3 -2 l3 2 l3 -3 q-9 8 -18 0 z"/>
                    </g>
                </g>

                <!--thanksgiving: a turkey with a wobbling tail-->
                <g v-else-if="theme.id === 'thanksgiving'">
                    <g class="tail">
                        <g v-for="(a, i) in [-75, -50, -25, 0, 25, 50, 75]" :key="'tt' + i" :transform="`translate(32 40) rotate(${a}) translate(0 -13)`">
                            <ellipse rx="4.6" ry="11" :fill="['#c2410c', '#f59e0b', '#ea580c', '#b45309'][i % 4]"/>
                        </g>
                    </g>
                    <circle cx="32" cy="43" r="10.5" fill="#7c4a1e"/>
                    <g class="head">
                        <circle cx="32" cy="30" r="5.4" fill="#8b5a2b"/>
                        <circle cx="30.4" cy="29" r="0.8" fill="#fff"/>
                        <circle cx="33.6" cy="29" r="0.8" fill="#fff"/>
                        <path d="M30.8 31 l1.2 2.4 l1.2 -2.4 z" fill="#f59f00"/>
                        <path d="M32.6 32.4 q1.6 2 0 4 q-1 -2 0 -4 z" fill="#e03131"/>
                    </g>
                    <path d="M28.5 53 v5 M35.5 53 v5" stroke="#f59f00" stroke-width="1.6" stroke-linecap="round"/>
                </g>

                <!--christmas: a tree with a shining star, twinkling lights and snow-->
                <g v-else-if="theme.id === 'christmas'">
                    <polygon points="32,12 44,27 20,27" fill="#37b24d"/>
                    <polygon points="32,20 48,38 16,38" fill="#2f9e44"/>
                    <polygon points="32,29 52,50 12,50" fill="#2b8a3e"/>
                    <rect x="29" y="50" width="6" height="7" fill="#8b5a2b"/>
                    <circle v-for="(l, i) in [[28, 24, '#ff6b6b'], [36, 25, '#ffd43b'], [24, 34, '#74c0fc'], [32, 33, '#ff6b6b'], [40, 35, '#ffd43b'], [20, 46, '#ffd43b'], [28, 44, '#74c0fc'], [37, 46, '#ff6b6b'], [44, 45, '#74c0fc']]" :key="'cl' + i" class="twinkle" :cx="l[0]" :cy="l[1]" r="1.7" :fill="l[2]" :style="delay(i, 1.5)"/>
                    <path class="star-top" d="M32 5 l1.9 3.9 l4.3 0.6 l-3.1 3 l0.7 4.3 l-3.8 -2 l-3.8 2 l0.7 -4.3 l-3.1 -3 l4.3 -0.6 z" fill="#ffd43b"/>
                    <circle v-for="(x, i) in [8, 54, 14, 50, 58]" :key="'cs' + i" class="snowfall" :cx="x" cy="6" r="1.1" fill="#ffffff" :style="delay(i, 3.5)"/>
                </g>

                <!--new year: fireworks over the new year's number-->
                <g v-else-if="theme.id === 'newyear'">
                    <g v-for="(b, i) in [[20, 20, '#ff6b6b'], [42, 18, '#ffd43b'], [33, 34, '#74c0fc']]" :key="'nf' + i" :transform="`translate(${b[0]} ${b[1]})`">
                        <g class="burst" :style="delay(i, 2.4)">
                            <path v-for="a in 8" :key="'nr' + a" :transform="`rotate(${a * 45})`" d="M0 -3 v-6" :stroke="b[2]" stroke-width="1.8" stroke-linecap="round"/>
                            <circle r="1.4" :fill="b[2]"/>
                        </g>
                    </g>
                    <text x="32" y="55" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" font-family="Inter, system-ui, sans-serif">{{ theme.year }}</text>
                </g>

                <!--valentine: a beating heart with small hearts floating up-->
                <g v-else-if="theme.id === 'valentine'">
                    <g v-for="(h, i) in [[12, 46], [50, 44], [44, 54]]" :key="'vh' + i" :transform="`translate(${h[0]} ${h[1]})`">
                        <g class="float-heart" :style="delay(i, 3)">
                            <path transform="scale(0.22) translate(-32 -33)" :d="heart" fill="#ff8fab"/>
                        </g>
                    </g>
                    <path class="beat" :d="heart" fill="#e64980"/>
                    <ellipse cx="23" cy="25" rx="4" ry="2.4" fill="#ffffff" opacity="0.3" transform="rotate(-30 23 25)"/>
                </g>

                <!--st patrick's: a swaying four-leaf clover and shiny gold coins-->
                <g v-else-if="theme.id === 'stpatrick'">
                    <g class="shamrock">
                        <path d="M32 31 q3 12 -1 24" stroke="#2f9e44" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                        <path v-for="a in [0, 90, 180, 270]" :key="'sl' + a" :transform="`rotate(${a} 32 30) translate(32 24.6) scale(0.3) translate(-32 -33)`" :d="heart" fill="#40c057" stroke="#2b8a3e" stroke-width="2"/>
                        <circle cx="32" cy="30" r="1.4" fill="#2b8a3e"/>
                    </g>
                    <circle cx="18" cy="48" r="5.5" fill="#fcc419" stroke="#e67700" stroke-width="1"/>
                    <circle cx="46" cy="48" r="5.5" fill="#fcc419" stroke="#e67700" stroke-width="1"/>
                    <path class="shine" d="M15.4 45.2 l3 -2" stroke="#fff9db" stroke-width="1.4" stroke-linecap="round"/>
                    <path class="shine shine-late" d="M43.4 45.2 l3 -2" stroke="#fff9db" stroke-width="1.4" stroke-linecap="round"/>
                </g>

                <!--spring: a blooming flower and a butterfly-->
                <g v-else-if="theme.id === 'spring'">
                    <path d="M0 56 q16 -4 32 0 t32 0 v8 h-64 z" fill="#40c057"/>
                    <g class="stem">
                        <path d="M32 58 q-2 -14 0 -28" stroke="#2f9e44" stroke-width="2.2" fill="none"/>
                        <path d="M31 46 q-8 -2 -10 -8 q7 0 10 6 z" fill="#51cf66"/>
                        <g class="petals">
                            <ellipse v-for="a in 6" :key="'sp' + a" cx="32" cy="22" rx="3.6" ry="7" fill="#f783ac" :transform="`rotate(${a * 60} 32 29)`"/>
                        </g>
                        <circle cx="32" cy="29" r="4" fill="#ffd43b"/>
                    </g>
                    <g class="butterfly">
                        <g class="flap">
                            <ellipse cx="46" cy="16" rx="4" ry="3" fill="#74c0fc"/>
                            <ellipse cx="52" cy="16" rx="4" ry="3" fill="#74c0fc"/>
                        </g>
                        <ellipse cx="49" cy="16.5" rx="0.8" ry="3" fill="#343a40"/>
                    </g>
                </g>

                <!--summer: a cool sun with sunglasses over the sea and a beach with a parasol-->
                <g v-else-if="theme.id === 'summer'">
                    <g transform="translate(6 -4)">
                        <g class="rays" stroke="#ffd43b" stroke-width="2.4" stroke-linecap="round">
                            <path v-for="a in 8" :key="'sr' + a" :transform="`rotate(${a * 45} 32 25)`" d="M32 8 v4"/>
                        </g>
                        <circle cx="32" cy="25" r="11" fill="#ffc72c"/>
                        <rect x="23.5" y="21.5" width="7.5" height="5" rx="2" fill="#212529"/>
                        <rect x="33" y="21.5" width="7.5" height="5" rx="2" fill="#212529"/>
                        <path d="M31 23 h2" stroke="#212529" stroke-width="1.2"/>
                        <path d="M28 30 q4 3 8 0" stroke="#b35a00" stroke-width="1.4" fill="none" stroke-linecap="round"/>
                    </g>
                    <path class="wave" d="M-32 46 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 v22 h-112 z" fill="#339af0"/>
                    <path class="wave wave-late" d="M-32 52 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 v16 h-112 z" fill="#1c7ed6"/>
                    <path d="M-6 66 V50 Q10 46 24 52 Q34 57 40 66 Z" fill="#f2d49b"/>
                    <path d="M-6 66 V55 Q12 52 26 58 Q33 61 36 66 Z" fill="#e9c27d" opacity="0.6"/>
                    <path d="M15 52 L18 36" stroke="#8b5a2b" stroke-width="1.2" stroke-linecap="round"/>
                    <g class="parasol">
                        <path d="M8 38 Q18 28 28 38 Z" fill="#ff6b6b"/>
                        <path d="M14.6 36.2 Q18 30.6 18 30.6 Q18 30.6 21.4 36.2 Q18 34.4 14.6 36.2 Z" fill="#ffffff"/>
                        <path d="M8 38 Q10.5 36.6 13 38 Q15.5 36.6 18 38 Q20.5 36.6 23 38 Q25.5 36.6 28 38" fill="none" stroke="#c92a2a" stroke-width="0.6"/>
                    </g>
                    <circle cx="27" cy="54" r="2.2" fill="#ffffff"/>
                    <path d="M25 53 q2 1 4 -0.6" stroke="#4dabf7" stroke-width="0.8" fill="none"/>
                </g>

                <!--autumn: colorful leaves falling and turning-->
                <g v-else-if="theme.id === 'autumn'">
                    <path d="M4 10 q20 6 44 -2" stroke="#6b3e1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                    <g v-for="(l, i) in [[16, '#e8590c'], [30, '#f08c00'], [44, '#c92a2a'], [24, '#fab005'], [52, '#d9480f']]" :key="'al' + i" :transform="`translate(${l[0]} 12)`">
                        <path class="leaf" d="M0 -5 C4 -3 5 1 0 6 C-5 1 -4 -3 0 -5 Z M0 -5 V6" :fill="l[1]" stroke="#7a2e0e" stroke-width="0.5" :style="delay(i, 4)"/>
                    </g>
                </g>

                <!--winter: a swaying snowman in falling snow-->
                <g v-else-if="theme.id === 'winter'">
                    <circle v-for="(x, i) in [8, 20, 44, 56, 14, 50]" :key="'ws' + i" class="snowfall" :cx="x" cy="4" r="1.2" fill="#ffffff" :style="delay(i, 3.5)"/>
                    <path d="M0 57 q32 -6 64 0 v7 h-64 z" fill="#e9f2ff"/>
                    <g class="snowman">
                        <path d="M22 41 l-8 -6 M42 41 l8 -6" stroke="#8b5a2b" stroke-width="1.6" stroke-linecap="round"/>
                        <circle cx="32" cy="46" r="11" fill="#ffffff"/>
                        <circle cx="32" cy="29" r="8" fill="#ffffff"/>
                        <rect x="25" y="34" width="14" height="3.4" rx="1.5" fill="#e03131"/>
                        <rect x="37" y="34" width="3.4" height="7" rx="1.5" fill="#e03131"/>
                        <rect x="25" y="19" width="14" height="2.4" fill="#212529"/>
                        <rect x="27.5" y="12" width="9" height="8" fill="#212529"/>
                        <circle cx="29.3" cy="27.5" r="0.9" fill="#212529"/>
                        <circle cx="34.7" cy="27.5" r="0.9" fill="#212529"/>
                        <path d="M32 29.5 l5 1.2 l-5 1.2 z" fill="#fd7e14"/>
                        <circle cx="32" cy="43" r="0.9" fill="#212529"/>
                        <circle cx="32" cy="48" r="0.9" fill="#212529"/>
                    </g>
                </g>
            </g>
            <!--nowruz: a haft-sin table on three shelves that follow the corner, items stand upright on desktop (bottom) and mobile (top)-->
            <!--on mobile the curve comes closer to the items, so the table is a bit smaller there, shrunk toward the corner-->
            <g v-if="theme.id === 'nowruz'" :transform="isDesktop ? null : 'translate(100 0) scale(0.9) translate(-100 0)'">
                <rect v-for="(row, i) in shelves" :key="'shelf' + i" :x="row.from" :y="row.y" :width="100 - row.from" height="1.3" :fill="i === 0 ? '#a61e4d' : '#c9a227'"/>
                <!--shelf 1: painted eggs, seeb, seer, serkeh, samanu, senjed, somaq and sekkeh-->
                <g :transform="`translate(47.5 ${shelves[0].y})`">
                    <ellipse v-for="(egg, i) in [[-2.6, '#4dabf7'], [0, '#f783ac'], [2.6, '#ffd43b']]" :key="'egg' + i" class="egg" :cx="egg[0]" cy="-1.9" rx="1.25" ry="1.8" :fill="egg[1]" :style="delay(i, 1.8)"/>
                </g>
                <g :transform="`translate(55 ${shelves[0].y})`">
                    <circle cy="-3.2" r="3.1" fill="#e03131"/>
                    <path d="M0 -6.2 v-1.6" stroke="#5c3d2e" stroke-width="0.6"/>
                    <path d="M0.3 -7.2 q2 -1 2.4 0.4 q-1.4 0.6 -2.4 -0.4 z" fill="#51cf66"/>
                </g>
                <g :transform="`translate(62 ${shelves[0].y})`">
                    <path d="M0 -7.5 C2 -5.5 3.4 -3.4 3 -1.2 C2.6 0 -2.6 0 -3 -1.2 C-3.4 -3.4 -2 -5.5 0 -7.5 Z" fill="#f8f9fa" stroke="#ced4da" stroke-width="0.3"/>
                    <path d="M0 -7 v6.6 M-1.5 -5 q-0.6 2.4 0 4.6 M1.5 -5 q0.6 2.4 0 4.6" stroke="#dee2e6" stroke-width="0.3" fill="none"/>
                </g>
                <g :transform="`translate(68.5 ${shelves[0].y})`">
                    <rect x="-2.3" y="-7.4" width="4.6" height="7.4" rx="1" fill="#862e9c"/>
                    <rect x="-0.9" y="-10" width="1.8" height="2.8" fill="#862e9c"/>
                    <rect x="-1.1" y="-11" width="2.2" height="1.2" rx="0.3" fill="#b08968"/>
                    <path d="M-1.4 -6.4 v4.4" stroke="#ffffff" stroke-width="0.5" opacity="0.5"/>
                </g>
                <g v-for="(bowl, i) in [[75, '#a0703c', false], [82, '#d9480f', true], [89, '#a61e4d', false]]" :key="'bowl' + i" :transform="`translate(${bowl[0]} ${shelves[0].y})`">
                    <ellipse v-if="!bowl[2]" cy="-3.6" rx="3.6" ry="1.3" :fill="bowl[1]"/>
                    <g v-else :fill="bowl[1]">
                        <circle cx="-1.6" cy="-3.8" r="0.9"/><circle cx="0" cy="-4.3" r="0.9"/><circle cx="1.6" cy="-3.8" r="0.9"/><circle cx="-0.8" cy="-5.1" r="0.9"/><circle cx="0.8" cy="-5.1" r="0.9"/>
                    </g>
                    <path d="M-4 -3.6 h8 a4 3.4 0 0 1 -8 0 z" fill="#e7f5ff"/>
                    <path d="M-3.2 -2.6 h6.4" stroke="#4dabf7" stroke-width="0.4"/>
                </g>
                <g :transform="`translate(95.6 ${shelves[0].y})`">
                    <ellipse cy="-1" rx="3" ry="1.1" fill="#fcc419" stroke="#e67700" stroke-width="0.3"/>
                    <ellipse cy="-2.3" rx="3" ry="1.1" fill="#fcc419" stroke="#e67700" stroke-width="0.3"/>
                    <ellipse cy="-3.6" rx="3" ry="1.1" fill="#fcc419" stroke="#e67700" stroke-width="0.3"/>
                    <path class="shine" d="M-1.6 -4.1 l1.2 -0.5" stroke="#fff9db" stroke-width="0.6" stroke-linecap="round"/>
                </g>
                <!--shelf 2: sabzeh, candles around the mirror and a hyacinth-->
                <g :transform="`translate(73 ${shelves[1].y})`">
                    <path v-for="(x, i) in [-3, -1.8, -0.6, 0.6, 1.8, 3]" :key="'blade' + i" class="blade" :d="`M${x} -3.2 q${i % 2 ? 0.8 : -0.8} -3.6 ${i % 2 ? -0.4 : 0.4} -${6.4 + (i % 3) * 1.2}`" stroke="#51cf66" stroke-width="0.9" stroke-linecap="round" fill="none" :style="delay(i, 2.4)"/>
                    <rect x="-3.8" y="-4.4" width="7.6" height="1.6" fill="#e03131"/>
                    <ellipse cy="-1.4" rx="4.6" ry="1.5" fill="#e5b33b"/>
                </g>
                <g v-for="(x, i) in [79.6, 90.4]" :key="'candle' + i" :transform="`translate(${x} ${shelves[1].y})`">
                    <rect x="-1" y="-6.4" width="2" height="6.4" rx="0.3" fill="#fff3bf"/>
                    <path class="flicker" :class="{ 'flicker-late': i }" d="M0 -10.4 c1.2 1.6 1.4 3 0 3.8 c-1.4 -0.8 -1.2 -2.2 0 -3.8 z" fill="#ffb703"/>
                </g>
                <g :transform="`translate(85 ${shelves[1].y})`">
                    <ellipse cy="-5.4" rx="3.3" ry="5" fill="#a5d8ff" stroke="#e5b33b" stroke-width="0.9"/>
                    <path class="mirror-shine" d="M-1.6 -8 l2.2 -1.6" stroke="#ffffff" stroke-width="0.7" stroke-linecap="round"/>
                </g>

                <g :transform="`translate(96 ${shelves[1].y})`">
                    <g class="hyacinth">
                        <path d="M0 0 v-6" stroke="#2f9e44" stroke-width="0.8"/>
                        <path d="M0 -1 q-2.4 -2 -2.6 -5 q2 1.6 2.6 5 z M0 -1 q2.4 -2 2.6 -5 q-2 1.6 -2.6 5 z" fill="#51cf66"/>
                        <circle v-for="(f, i) in [[0, -10.6], [-1, -9.6], [1, -9.6], [-1.2, -8.4], [1.2, -8.4], [0, -9], [-1, -7.2], [1, -7.2], [0, -6.4]]" :key="'fl' + i" :cx="f[0]" :cy="f[1]" r="0.8" fill="#9775fa"/>
                    </g>
                </g>
                <!--shelf 3: the new year in the shahanshahi calendar with the solar hijri year faintly under it, and the goldfish bowl-->
                <g :transform="`translate(91 ${shelves[2].y})`">
                    <text y="-4" text-anchor="end" font-size="5.5" font-weight="800" fill="#ffd43b" font-family="Inter, system-ui, sans-serif">{{ persianYear + 1180 }}</text>
                    <text y="-1" text-anchor="end" font-size="2.4" fill="#ffffff" opacity="0.35" font-family="Inter, system-ui, sans-serif">{{ persianYear }} SH</text>
                </g>
                <g :transform="`translate(95.4 ${shelves[2].y}) scale(0.8)`">
                    <circle cy="-5.6" r="5.3" fill="#74c0fc" fill-opacity="0.35" stroke="#a5d8ff" stroke-width="0.6"/>
                    <path d="M-4.4 -8.4 h8.8" stroke="#a5d8ff" stroke-width="0.4"/>
                    <g class="fish-small">
                        <path d="M-1.6 -4.6 l-1.8 -1.3 v2.6 z" fill="#ff922b"/>
                        <ellipse cx="0.4" cy="-4.6" rx="2" ry="1.3" fill="#ff922b"/>
                    </g>
                </g>
            </g>
            </g>
            <path :d="arcPath" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.8"/>
            </g>
        </svg>
        <div class="absolute bg-black bg-opacity-80 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none transition-opacity"
            :class="open || hover ? 'opacity-100' : 'opacity-0'" :style="tipPosition">
            {{ label }}
        </div>
    </div>
</template>

<script>
import { themeFor, toPersian } from '../seasonal.js';
import { preview, previewDate } from '../preview.js';


const LABELS = {
    yalda: 'Happy Yalda Night · شب یلدا ',
    suri: 'Happy Chaharshanbe Suri · چهارشنبه‌سوری ',
    nowruz: 'Happy Nowruz · نوروز پیروز',
    halloween: 'Happy Halloween',
    thanksgiving: 'Happy Thanksgiving',
    christmas: 'Merry Christmas',
    newyear: 'Happy New Year',
    valentine: "Happy Valentine's Day",
    stpatrick: "Happy St. Patrick's Day",
    spring: 'Spring · بهار',
    summer: 'Summer · تابستان',
    autumn: 'Autumn · پاییز',
    winter: 'Winter · زمستان'
};
const BACKGROUNDS = {
    yalda: '#2a1630', suri: '#2b1a12', nowruz: '#14301f', halloween: '#24162e', thanksgiving: '#2e2112',
    christmas: '#10261a', newyear: '#101a33', valentine: '#33121f', stpatrick: '#11291a',
    spring: '#1d2b1a', summer: '#163049', autumn: '#2e1f12', winter: '#18263a'
};

export default {
    data() {
        return {
            theme: { id: 'spring' },
            open: false,
            hover: false,
            isDesktop: true,
            media: null,
            labels: LABELS,
            preview,
            heart: 'M32 50 C20 41 13 34 13 26 C13 20 18 16 23 16 C27 16 30 18 32 21 C34 18 37 16 41 16 C46 16 51 20 51 26 C51 34 44 41 32 50 Z',
            timer: null
        }
    },
    computed: {
        size() {
            return this.isDesktop ? 260 : 150;
        },
        // the corner piece: two sides on the screen edges and a curve that is part of a circle centered at the far corner of the square
        cornerPath() {
            return this.isDesktop ? 'M0 100 A100 100 0 0 0 100 0 L100 100 Z' : 'M0 0 A100 100 0 0 1 100 100 L100 0 Z';
        },
        arcPath() {
            return this.isDesktop ? 'M0 100 A100 100 0 0 0 100 0' : 'M0 0 A100 100 0 0 1 100 100';
        },
        sceneTransform() {
            // the biggest circle that fits in the corner piece has radius (sqrt2 - 1)^2 of the side,
            // the drawings of a scene reach about 27 units from its center, so they fit in that circle
            const r = 100 * (Math.SQRT2 - 1) ** 2;
            const scale = r / 27;
            const cx = 100 - r;
            const cy = this.isDesktop ? 100 - r : r;
            return `translate(${cx - 32 * scale} ${cy - 32 * scale}) scale(${scale})`;
        },
        // the three haft-sin shelves, bands measured from the screen edge, each shelf starts where the curve allows
        shelves() {
            return [[3, 13], [16, 27], [29, 41]].map(([near, far]) => {
                const level = this.isDesktop ? near : far;
                return {
                    y: this.isDesktop ? 100 - near : far,
                    from: Math.sqrt(10000 - (100 - level) ** 2)
                };
            });
        },
        // the solar hijri year that starts at this nowruz, previews use the next one
        persianYear() {
            if (this.theme.day) return toPersian(this.theme.day).year;
            return toPersian(new Date()).year + 1;
        },
        tipPosition() {
            const side = `${Math.round(this.size * 0.4)}px`;
            return this.isDesktop ? { right: side, bottom: '12px' } : { right: side, top: '12px' };
        },
        label() {
            const text = LABELS[this.theme.id];
            return this.theme.id === 'newyear' ? `${text} ${this.theme.year}` : text;
        },
        background() {
            return BACKGROUNDS[this.theme.id];
        }
    },
    methods: {
        pickTheme() {
            // the preview settings (dev panel or ?theme= / ?date= in the url) can force a theme or a date
            if (preview.theme && LABELS[preview.theme]) return { id: preview.theme, year: new Date().getFullYear() + 1 };
            try {
                return themeFor(previewDate());
            } catch (error) {
                // very old browsers without the persian calendar
                console.log(error);
                return { id: 'spring' };
            }
        },
        onMediaChange(event) {
            this.isDesktop = event.matches;
        },
        delay(i, duration) {
            // spreads repeated pieces over the animation so they do not move together
            return { animationDelay: `${-(i * duration / 4).toFixed(2)}s` };
        }
    },
    watch: {
        'preview.theme'() {
            this.theme = this.pickTheme();
        },
        'preview.date'() {
            this.theme = this.pickTheme();
        }
    },
    created() {
        this.theme = this.pickTheme();
    },
    mounted() {
        this.media = window.matchMedia('(min-width: 768px)');
        this.isDesktop = this.media.matches;
        this.media.addEventListener('change', this.onMediaChange);
        // the day can change while the page stays open
        this.timer = setInterval(() => { this.theme = this.pickTheme(); }, 60 * 60 * 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
        this.media.removeEventListener('change', this.onMediaChange);
    }
}
</script>

<style scoped>
.seasonal {
    -webkit-tap-highlight-color: transparent;
}
/* the square is transparent, only the corner piece catches the mouse so the page under it stays clickable */
.seasonal, .seasonal svg {
    pointer-events: none;
}
.corner {
    pointer-events: visiblePainted;
    cursor: pointer;
}
.seasonal svg {
    filter: drop-shadow(-2px -2px 6px rgb(0 0 0 / 0.35));
}
/* only animated pieces (they have a class) turn around their own center, static transforms keep their normal origin */
.seasonal svg [class] {
    transform-box: fill-box;
    transform-origin: center;
}

/* shared */
.twinkle {
    animation: twinkle 1.8s ease-in-out infinite;
}
.glow {
    animation: glow 1.6s ease-in-out infinite alternate;
}
.flicker {
    transform-origin: 50% 100%;
    animation: flicker 0.45s ease-in-out infinite alternate;
}
.flicker-late {
    animation-delay: -0.2s;
}
.snowfall {
    animation: snowfall 3.5s linear infinite;
}

/* yalda */
.seed {
    animation: twinkle 2s ease-in-out infinite;
}

/* suri */
.flame-group {
    transform-origin: 50% 100%;
    animation: sway 1.2s ease-in-out infinite alternate;
}
.spark {
    animation: spark 1.6s ease-out infinite;
}

/* nowruz */
.blade {
    transform-origin: 50% 100%;
    animation: blade 2.4s ease-in-out infinite alternate;
}
.fish {
    animation: swim 5s ease-in-out infinite;
}
.bubble {
    animation: bubble 2.2s ease-out infinite;
}

/* nowruz */
.fish-small {
    animation: swim-small 4s ease-in-out infinite;
}
.mirror-shine {
    animation: mirror-shine 3s ease-in-out infinite;
}
.egg {
    transform-origin: 50% 100%;
    animation: egg 1.8s ease-in-out infinite;
}
.hyacinth {
    transform-origin: 50% 100%;
    animation: sway 2.8s ease-in-out infinite alternate;
}
@keyframes swim-small {
    0% { transform: translateX(-1.6px) scaleX(1); }
    45% { transform: translateX(1.6px) scaleX(1); }
    50% { transform: translateX(1.6px) scaleX(-1); }
    95% { transform: translateX(-1.6px) scaleX(-1); }
    100% { transform: translateX(-1.6px) scaleX(1); }
}
@keyframes mirror-shine {
    0%, 60%, 100% { opacity: 0; transform: translate(-1px, 2px); }
    75% { opacity: 1; }
    90% { opacity: 0; transform: translate(2px, -1px); }
}
@keyframes egg {
    0%, 100% { transform: rotate(-8deg); }
    50% { transform: rotate(8deg); }
}

/* halloween */
.bat {
    animation: bat 3s ease-in-out infinite;
}
.wings {
    animation: flap 0.3s ease-in-out infinite alternate;
}
.face {
    animation: candle 1.2s ease-in-out infinite;
}

/* thanksgiving */
.tail {
    transform-origin: 50% 100%;
    animation: wobble 2.2s ease-in-out infinite;
}
.head {
    animation: nod 1.4s ease-in-out infinite;
}

/* christmas */
.star-top {
    animation: star 2s ease-in-out infinite;
}

/* new year */
.burst {
    animation: burst 2.4s ease-out infinite;
}

/* valentine */
.beat {
    animation: beat 1.1s ease-in-out infinite;
}
.float-heart {
    animation: float-up 3s ease-out infinite;
}

/* st patrick's */
.shamrock {
    transform-origin: 50% 100%;
    animation: sway 2.4s ease-in-out infinite alternate;
}
.shine {
    animation: twinkle 1.6s ease-in-out infinite;
}
.shine-late {
    animation-delay: -0.8s;
}

/* spring */
.stem {
    transform-origin: 50% 100%;
    animation: sway 3s ease-in-out infinite alternate;
}
.petals {
    animation: bloom 3s ease-in-out infinite;
}
.butterfly {
    animation: flutter 4s ease-in-out infinite;
}
.flap {
    animation: flap-x 0.25s ease-in-out infinite alternate;
}

/* summer */
.rays {
    animation: spin 10s linear infinite;
}
.wave {
    animation: wave 3s linear infinite;
}
.wave-late {
    animation-duration: 4.5s;
    animation-direction: reverse;
}

.parasol {
    transform-origin: 50% 100%;
    animation: sway 2.8s ease-in-out infinite alternate;
}

/* autumn */
.leaf {
    animation: leaf 4s ease-in infinite;
}

/* winter */
.snowman {
    transform-origin: 50% 100%;
    animation: sway 2.6s ease-in-out infinite alternate;
}

@keyframes twinkle {
    0%, 100% { opacity: 0.35; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.15); }
}
@keyframes glow {
    from { opacity: 0.6; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1.1); }
}
@keyframes flicker {
    from { transform: scale(0.9, 0.85) skewX(-4deg); }
    to { transform: scale(1.05, 1.12) skewX(4deg); }
}
@keyframes sway {
    from { transform: rotate(-4deg); }
    to { transform: rotate(4deg); }
}
@keyframes spark {
    0% { transform: translate(0, 4px); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translate(3px, -18px); opacity: 0; }
}
@keyframes blade {
    from { transform: rotate(-7deg); }
    to { transform: rotate(7deg); }
}
@keyframes swim {
    0% { transform: translateX(-4px) scaleX(1); }
    45% { transform: translate(4px, 1px) scaleX(1); }
    50% { transform: translate(4px, 1px) scaleX(-1); }
    95% { transform: translateX(-4px) scaleX(-1); }
    100% { transform: translateX(-4px) scaleX(1); }
}
@keyframes bubble {
    0% { transform: translateY(0) scale(0.6); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(-9px) scale(1); opacity: 0; }
}
@keyframes bat {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(6px, -3px); }
    50% { transform: translate(10px, 2px); }
    75% { transform: translate(4px, 4px); }
}
@keyframes flap {
    from { transform: scaleY(1); }
    to { transform: scaleY(0.35); }
}
@keyframes candle {
    0%, 100% { opacity: 1; }
    40% { opacity: 0.65; }
    60% { opacity: 0.9; }
    80% { opacity: 0.55; }
}
@keyframes wobble {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
}
@keyframes nod {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(1.5px); }
}
@keyframes star {
    0%, 100% { transform: scale(1) rotate(0); }
    50% { transform: scale(1.25) rotate(20deg); }
}
@keyframes burst {
    0% { transform: scale(0.1); opacity: 0; }
    15% { opacity: 1; }
    60% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1.3); opacity: 0; }
}
@keyframes beat {
    0%, 40%, 100% { transform: scale(1); }
    15% { transform: scale(1.14); }
    28% { transform: scale(1.04); }
}
@keyframes float-up {
    0% { transform: translateY(4px) scale(0.6); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(-26px) scale(1); opacity: 0; }
}
@keyframes bloom {
    0%, 100% { transform: scale(0.92) rotate(0); }
    50% { transform: scale(1.06) rotate(20deg); }
}
@keyframes flutter {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-6px, 4px); }
    50% { transform: translate(-12px, -2px); }
    75% { transform: translate(-5px, -5px); }
}
@keyframes flap-x {
    from { transform: scaleX(1); }
    to { transform: scaleX(0.3); }
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
@keyframes wave {
    from { transform: translateX(0); }
    to { transform: translateX(16px); }
}
@keyframes leaf {
    0% { transform: translate(0, 0) rotate(0); opacity: 0; }
    10% { opacity: 1; }
    40% { transform: translate(-5px, 18px) rotate(120deg); }
    70% { transform: translate(4px, 32px) rotate(220deg); }
    100% { transform: translate(-2px, 48px) rotate(330deg); opacity: 0; }
}
@keyframes snowfall {
    0% { transform: translate(0, 0); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translate(3px, 28px); }
    100% { transform: translate(-2px, 58px); opacity: 0.2; }
}
@media (prefers-reduced-motion: reduce) {
    .seasonal svg * {
        animation: none !important;
    }
}
</style>
