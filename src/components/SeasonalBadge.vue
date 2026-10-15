<template>
    <!--an animated scene for the current persian event, american event or persian season,
        drawn in the curved corner piece that is left when a circle sits inside a square: stuck to the bottom right corner of the screen on desktop, on mobile it sits at the top right of the page and scrolls away-->
    <!--rendered straight into the body so it sits against the real page edges, not inside the padded app container-->
    <Teleport to="body">
        <div class="seasonal z-30 right-0" :class="isDesktop ? 'fixed bottom-0' : 'absolute top-0'" :style="{ width: `${size}px`, height: `${size}px` }">
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

                    <!--sizdah bedar: a picnic by a stream, the sabzeh floats away on the water, volleyball, joojeh kebab on the grill, tea on the blanket and a kite in the sky-->
                    <g v-else-if="theme.id === 'sizdah'">
                        <!--kite-->
                        <g transform="translate(44 12)">
                            <g class="kite">
                                <path d="M0 -5 L4 0 L0 6 L-4 0 Z" fill="#ff6b6b"/>
                                <path d="M0 -5 L0 6 M-4 0 L4 0" stroke="#ffd43b" stroke-width="0.5"/>
                                <path d="M0 6 q-2 3 0 5 q2 3 -1 6" stroke="#ffffff" stroke-width="0.5" fill="none" opacity="0.8"/>
                                <path d="M-1 9.6 l1 -0.8 l1 0.8 z M-0.6 13.6 l1 -0.8 l1 0.8 z" fill="#4dabf7"/>
                            </g>
                        </g>
                        <!--grass and a tree-->
                        <path d="M-40 38 Q16 34 104 38 V170 H-40 Z" fill="#69db7c"/>
                        <path d="M-40 44 Q20 41 104 46 V170 H-40 Z" fill="#51cf66"/>
                        <rect x="57.2" y="27" width="1.6" height="11" fill="#6b3e1f"/>
                        <g class="blossom">
                            <circle cx="58" cy="23" r="5.4" fill="#40c057"/>
                            <circle cx="54.4" cy="26" r="3.2" fill="#37b24d"/>
                            <circle cx="61.6" cy="26" r="3.4" fill="#2f9e44"/>
                        </g>
                        <!--volleyball: a net on the grass, two players jumping and the ball going over the net-->
                        <path d="M19 38 V29 M33 38 V29" stroke="#dee2e6" stroke-width="0.7"/>
                        <rect x="19" y="29.4" width="14" height="3.6" fill="none" stroke="#ffffff" stroke-width="0.4" opacity="0.8"/>
                        <path d="M21.8 29.4 v3.6 M24.6 29.4 v3.6 M27.4 29.4 v3.6 M30.2 29.4 v3.6" stroke="#ffffff" stroke-width="0.3" opacity="0.6"/>
                        <g v-for="(pl, i) in [[14, '#4dabf7', 'jump-left'], [38, '#ff6b6b', 'jump-right']]" :key="'vp' + i" :transform="`translate(${pl[0]} 38)`">
                            <g :class="pl[2]">
                                <circle cy="-8.6" r="1.4" fill="#f1c27d"/>
                                <path d="M0 -7.2 v4" :stroke="pl[1]" stroke-width="1.6" stroke-linecap="round"/>
                                <path d="M0 -6.4 l-1.8 -2.6 M0 -6.4 l1.8 -2.6" :stroke="pl[1]" stroke-width="0.8" stroke-linecap="round"/>
                                <path d="M0 -3.2 l-1.2 3.2 M0 -3.2 l1.2 3.2" stroke="#495057" stroke-width="0.8" stroke-linecap="round"/>
                            </g>
                        </g>
                        <g transform="translate(15 27)">
                            <circle class="volleyball" r="1.3" fill="#ffffff" stroke="#ffd43b" stroke-width="0.4"/>
                        </g>
                        <!--stream flowing from the back to the front, with moving ripples-->
                        <path d="M4 39.4 Q20 42 27 50 Q34 59 48 65 T96 112" stroke="#4dabf7" stroke-width="5" fill="none" stroke-linecap="round"/>
                        <path class="ripple" d="M4 39.4 Q20 42 27 50 Q34 59 48 65 T96 112" stroke="#d0ebff" stroke-width="0.7" fill="none" stroke-dasharray="2 3"/>
                        <path class="ripple ripple-late" d="M6 38.4 Q21 41 28.4 49 Q35.6 58 50 63.6 T98 110" stroke="#d0ebff" stroke-width="0.5" fill="none" stroke-dasharray="1.4 3.6" opacity="0.7"/>
                        <!--the sabzeh floating downstream-->
                        <g class="sabzeh-float">
                            <ellipse cx="0" cy="0" rx="3.2" ry="1.1" fill="#e5b33b"/>
                            <rect x="-2.6" y="-2" width="5.2" height="1.2" fill="#e03131"/>
                            <path d="M-2 -2 l-0.4 -3 M-0.7 -2 l0 -3.6 M0.7 -2 l0 -3.4 M2 -2 l0.4 -3" stroke="#51cf66" stroke-width="0.7" stroke-linecap="round"/>
                        </g>
                        <!--a grill with joojeh kebab skewers, glowing coals and smoke, on mobile it moves under the blanket where the curve leaves room-->
                        <g :transform="isDesktop ? 'translate(15 56)' : 'translate(50 61)'">
                            <path class="grill-smoke" d="M-2 -5 q-1.2 -2 0 -4 q1.2 -2 0 -4" stroke="#dee2e6" stroke-width="0.6" fill="none" opacity="0.7"/>
                            <path class="grill-smoke grill-smoke-late" d="M2 -5 q-1.2 -2 0 -4 q1.2 -2 0 -4" stroke="#dee2e6" stroke-width="0.6" fill="none" opacity="0.7"/>
                            <rect class="coals" x="-5.4" y="-3.6" width="10.8" height="1.2" fill="#ff6b00"/>
                            <path d="M-6 -3 h12 l-1 3.4 h-10 z" fill="#495057"/>
                            <path d="M-4.4 0.4 l-0.8 3 M4.4 0.4 l0.8 3" stroke="#343a40" stroke-width="0.6"/>
                            <g v-for="(y, i) in [-4.2, -5.4]" :key="'sk' + i">
                                <path :d="`M-7 ${y} h14`" stroke="#adb5bd" stroke-width="0.4"/>
                                <rect v-for="(x, j) in [-4.4, -2.2, 0, 2.2, 4.4]" :key="'jj' + j" :x="x - 0.8" :y="y - 0.8" width="1.6" height="1.6" rx="0.4" :fill="j === 2 ? '#e03131' : '#f59f00'"/>
                            </g>
                        </g>
                        <!--picnic blanket with a teapot, tea glasses and fruit-->
                        <path d="M38 46 L55 44 L59 51 L42 53 Z" fill="#c92a2a"/>
                        <path d="M39.4 47.6 L56 45.6 M41.4 51.2 L58 49.2" stroke="#fcc419" stroke-width="0.5"/>
                        <g transform="translate(51 46.6)">
                            <path class="steam" d="M0 -6.6 q-1 -1.4 0 -2.8 q1 -1.4 0 -2.8" stroke="#ffffff" stroke-width="0.5" fill="none" opacity="0.7"/>
                            <ellipse cx="0" cy="-2.4" rx="2.6" ry="2.4" fill="#e7f5ff"/>
                            <path d="M2.2 -3 l2 -1.6" stroke="#e7f5ff" stroke-width="0.8" stroke-linecap="round"/>
                            <rect x="-1" y="-5.6" width="2" height="1" rx="0.4" fill="#74c0fc"/>
                            <path d="M-2.4 -2.4 h4.8" stroke="#74c0fc" stroke-width="0.4"/>
                        </g>
                        <g v-for="(x, i) in [44.4, 47]" :key="'tea' + i" :transform="`translate(${x} ${49 - i * 0.4})`">
                            <path d="M-0.9 -2.4 h1.8 l-0.4 2.4 h-1 z" fill="#c2410c" opacity="0.9"/>
                        </g>
                        <circle cx="55.6" cy="48.6" r="1.1" fill="#e03131"/>
                        <circle cx="57" cy="49.4" r="1" fill="#ffa94d"/>
                        <circle cx="56.2" cy="47.4" r="0.9" fill="#94d82d"/>
                    </g>

                    <!--easter: a hopping bunny, a chick peeking out of a cracked egg and painted eggs on the grass-->
                    <g v-else-if="theme.id === 'easter'">
                        <path d="M-40 52 Q32 46 104 52 V170 H-40 Z" fill="#51cf66"/>
                        <path d="M6 52 l1 -3 l1 3 M18 50 l1 -3 l1 3 M50 51 l1 -3 l1 3 M58 52 l1 -3 l1 3" stroke="#2f9e44" stroke-width="0.8" fill="none"/>
                        <!--bunny hopping-->
                        <g class="hop">
                            <ellipse cx="22" cy="20" rx="2" ry="7" fill="#ffffff" transform="rotate(-12 22 20)"/>
                            <ellipse cx="22" cy="20" rx="0.9" ry="5.4" fill="#ffc9de" transform="rotate(-12 22 20)"/>
                            <ellipse cx="28" cy="20" rx="2" ry="7" fill="#ffffff" transform="rotate(10 28 20)"/>
                            <ellipse cx="28" cy="20" rx="0.9" ry="5.4" fill="#ffc9de" transform="rotate(10 28 20)"/>
                            <ellipse cx="26" cy="41" rx="9" ry="8" fill="#ffffff"/>
                            <circle cx="17.6" cy="42" r="2.4" fill="#f1f3f5"/>
                            <circle cx="25" cy="30" r="6" fill="#ffffff"/>
                            <circle cx="22.8" cy="29" r="0.8" fill="#212529"/>
                            <circle cx="27.2" cy="29" r="0.8" fill="#212529"/>
                            <path d="M24.2 31.6 l0.8 0.8 l0.8 -0.8 z" fill="#f783ac"/>
                            <circle cx="21.6" cy="31.6" r="1.1" fill="#ffc9de"/>
                            <circle cx="28.4" cy="31.6" r="1.1" fill="#ffc9de"/>
                            <ellipse cx="22" cy="48.4" rx="2.6" ry="1.4" fill="#f1f3f5"/>
                            <ellipse cx="30" cy="48.4" rx="2.6" ry="1.4" fill="#f1f3f5"/>
                        </g>
                        <!--chick peeking out of a cracked egg-->
                        <g transform="translate(44 50)">
                            <g class="peek">
                                <circle cx="0" cy="-6" r="3.4" fill="#ffd43b"/>
                                <circle cx="-1" cy="-6.6" r="0.5" fill="#212529"/>
                                <circle cx="1" cy="-6.6" r="0.5" fill="#212529"/>
                                <path d="M-0.7 -5.6 l0.7 1 l0.7 -1 z" fill="#f08c00"/>
                            </g>
                            <path d="M-4.4 -4 l1.4 1.4 l1.6 -1.6 l1.4 1.6 l1.6 -1.6 l1.4 1.4 l1.4 -1.2 q0.2 4.4 -4.4 4.6 q-4.8 -0.2 -4.4 -4.6 z" fill="#ffffff"/>
                        </g>
                        <!--painted eggs-->
                        <g v-for="(egg, i) in [[52, 51, '#74c0fc', '#ffffff'], [57.4, 53, '#f783ac', '#ffd43b'], [36, 54, '#b197fc', '#ffffff']]" :key="'ee' + i" :transform="`translate(${egg[0]} ${egg[1]})`">
                            <g class="egg" :style="delay(i, 1.8)">
                                <ellipse cy="-2.6" rx="2.2" ry="2.9" :fill="egg[2]"/>
                                <path d="M-2 -2.6 q1 -0.8 2 0 t2 0" :stroke="egg[3]" stroke-width="0.6" fill="none"/>
                                <circle cy="-4" r="0.45" :fill="egg[3]"/>
                            </g>
                        </g>
                    </g>

                    <!--halloween: a glowing jack-o'-lantern, a flapping bat and a glamorous witch flying past the moon on her broom-->
                    <g v-else-if="theme.id === 'halloween'">
                        <circle cx="47" cy="16" r="7" fill="#ffe066" opacity="0.9"/>
                        <g transform="translate(-8 8)">
                            <g class="bat">
                                <g class="wings" fill="#000000" stroke="#6f42c1" stroke-width="0.35" stroke-opacity="0.7">
                                    <path d="M20 17 q-5 -5 -10 -1 q3 1 3 4 q3 -1 7 0 z"/>
                                    <path d="M20 17 q5 -5 10 -1 q-3 1 -3 4 q-3 -1 -7 0 z"/>
                                </g>
                                <ellipse cx="20" cy="18" rx="2" ry="3" fill="#000000"/>
                                <path d="M18.6 15.4 l0.5 -1.4 l0.6 1 M21.4 15.4 l-0.5 -1.4 l-0.6 1" fill="#000000"/>
                            </g>
                        </g>
                        <g transform="translate(44 24) scale(0.85)">
                            <g class="witch">
                                <!--broom-->
                                <path d="M-11 2.4 L11 -0.6" stroke="#8b5a2b" stroke-width="1" stroke-linecap="round"/>
                                <path d="M-10.6 2.3 l-5.4 -2.6 l0.6 2.6 l-0.4 3 z" fill="#d4a017"/>
                                <path d="M-11 2.4 l-4.4 -1.2 M-11 2.4 l-4.6 1.4" stroke="#a87b0c" stroke-width="0.35"/>
                                <!--purple cape and flowing red hair blowing back-->
                                <path d="M-0.6 -6.4 q-6 0.4 -9.4 4.4 q4.6 -0.6 9.4 -1.4 z" fill="#7048e8"/>
                                <path class="hair" d="M-0.4 -9.6 q-4.6 0.2 -7.4 3.6 q2.6 -0.4 4 0.2 q-1.6 0.8 -2.2 2 q3 -1.6 5.6 -3.4 z" fill="#e8590c"/>
                                <!--skirt flowing back, legs along the broom with heeled boots-->
                                <path d="M-1.6 -1.6 q-3.4 0.8 -5.6 3.2 q3.4 0 6.4 -1.6 z" fill="#1a1020"/>
                                <path d="M-0.4 -0.8 L5.6 0.2" stroke="#1a1020" stroke-width="1.2" stroke-linecap="round"/>
                                <path d="M5.2 -0.6 l2 0.2 l0.4 1.4 l-2.6 0 z" fill="#7048e8"/>
                                <!--hourglass dress and an arm holding the broom-->
                                <path d="M-0.6 -7.8 q2.4 0.4 1.8 3 q-0.4 1.6 0.8 3.4 h-4.2 q1 -1.8 0.3 -3.4 q-0.6 -2.4 1.3 -3 z" fill="#1a1020"/>
                                <path d="M0.6 -6.4 q2 1.4 3.6 4.4" stroke="#1a1020" stroke-width="0.9" fill="none" stroke-linecap="round"/>
                                <circle cx="4.3" cy="-1.9" r="0.6" fill="#f1c27d"/>
                                <!--face and pointy hat with a purple band-->
                                <circle cx="0.6" cy="-9.4" r="1.6" fill="#f1c27d"/>
                                <circle cx="1.7" cy="-8.8" r="0.35" fill="#e03131"/>
                                <ellipse cx="0.4" cy="-10.7" rx="3.4" ry="0.7" fill="#000000"/>
                                <path d="M-1.4 -10.9 L-4.6 -16.6 L-3 -16.2 L1.8 -10.9 z" fill="#000000"/>
                                <path d="M-1.3 -11.6 h2.6" stroke="#7048e8" stroke-width="0.8"/>
                            </g>
                        </g>
                        <rect x="30.5" y="27" width="3" height="6" rx="1" fill="#2b8a3e"/>
                        <ellipse cx="25" cy="44" rx="9" ry="12" fill="#e8590c"/>
                        <ellipse cx="39" cy="44" rx="9" ry="12" fill="#e8590c"/>
                        <ellipse cx="32" cy="44" rx="9" ry="12.5" fill="#fd7e14"/>
                        <g class="face" fill="#ffd43b">
                            <path d="M24 39 l3.5 -4 l3.5 4 z M33 39 l3.5 -4 l3.5 4 z"/>
                            <path d="M23 46 l3 3 l3 -2 l3 2 l3 -2 l3 2 l3 -3 q-9 8 -18 0 z"/>
                        </g>
                        <!--a little ghost floating in the bottom left, on mobile the curve hides that spot so it floats under the pumpkin-->
                        <g :transform="isDesktop ? 'translate(9 47)' : 'translate(36 64)'">
                            <g class="ghost">
                                <path d="M-4.5 6 V-1 a4.5 4.5 0 0 1 9 0 V6 l-1.5 -1.4 l-1.5 1.4 l-1.5 -1.4 l-1.5 1.4 l-1.5 -1.4 z" fill="#f8f9fa"/>
                                <ellipse cx="-1.6" cy="-0.6" rx="0.8" ry="1.1" fill="#212529"/>
                                <ellipse cx="1.6" cy="-0.6" rx="0.8" ry="1.1" fill="#212529"/>
                                <ellipse cx="0" cy="2" rx="0.8" ry="1" fill="#212529"/>
                                <path d="M-4.5 1.6 q-2 0.6 -2.4 -1.4 M4.5 1.6 q2 0.6 2.4 -1.4" stroke="#f8f9fa" stroke-width="1.2" stroke-linecap="round" fill="none"/>
                            </g>
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

                    <!--christmas: a tree with a shining star, twinkling lights and snow, and santa claus waving next to it-->
                    <g v-else-if="theme.id === 'christmas'">
                        <circle v-for="(x, i) in [8, 54, 14, 50, 58]" :key="'cs' + i" class="snowfall" :cx="x" cy="6" r="1.1" fill="#ffffff" :style="delay(i, 3.5)"/>
                        <g transform="translate(-6 6) scale(0.82)">
                            <polygon points="32,12 44,27 20,27" fill="#37b24d"/>
                            <polygon points="32,20 48,38 16,38" fill="#2f9e44"/>
                            <polygon points="32,29 52,50 12,50" fill="#2b8a3e"/>
                            <rect x="29" y="50" width="6" height="7" fill="#8b5a2b"/>
                            <circle v-for="(l, i) in [[28, 24, '#ff6b6b'], [36, 25, '#ffd43b'], [24, 34, '#74c0fc'], [32, 33, '#ff6b6b'], [40, 35, '#ffd43b'], [20, 46, '#ffd43b'], [28, 44, '#74c0fc'], [37, 46, '#ff6b6b'], [44, 45, '#74c0fc']]" :key="'cl' + i" class="twinkle" :cx="l[0]" :cy="l[1]" r="1.7" :fill="l[2]" :style="delay(i, 1.5)"/>
                            <path class="star-top" d="M32 5 l1.9 3.9 l4.3 0.6 l-3.1 3 l0.7 4.3 l-3.8 -2 l-3.8 2 l0.7 -4.3 l-3.1 -3 l4.3 -0.6 z" fill="#ffd43b"/>
                        </g>
                        <g transform="translate(47 57)">
                            <!--sack of presents-->
                            <ellipse cx="-6.4" cy="-6" rx="3.4" ry="4.4" fill="#8b5a2b"/>
                            <path d="M-7.6 -10.4 l1.2 -1.4 l1.2 1.4" stroke="#5c3d2e" stroke-width="0.7" fill="none"/>
                            <!--boots, red suit with white trim and a black belt-->
                            <rect x="-4.2" y="-2" width="3.4" height="2" rx="0.6" fill="#212529"/>
                            <rect x="0.8" y="-2" width="3.4" height="2" rx="0.6" fill="#212529"/>
                            <path d="M-4.8 -2 L-4 -14 Q0 -15.8 4 -14 L4.8 -2 Z" fill="#e03131"/>
                            <rect x="-4.9" y="-3.4" width="9.8" height="1.6" rx="0.6" fill="#ffffff"/>
                            <rect x="-0.6" y="-14" width="1.2" height="11" fill="#ffffff"/>
                            <rect x="-4.5" y="-8.6" width="9" height="1.6" fill="#212529"/>
                            <rect x="-1" y="-8.9" width="2" height="2.2" fill="none" stroke="#ffd43b" stroke-width="0.6"/>
                            <path d="M-3.6 -12.8 L-5.4 -7.6" stroke="#e03131" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="-5.5" cy="-7.2" r="1.1" fill="#ffffff"/>
                            <!--arm waving-->
                            <g class="santa-wave">
                                <path d="M3.6 -12.8 L6.8 -17.4" stroke="#e03131" stroke-width="2" stroke-linecap="round"/>
                                <circle cx="7.1" cy="-18" r="1.1" fill="#ffffff"/>
                            </g>
                            <!--face, beard and hat-->
                            <circle cx="0" cy="-17.4" r="3" fill="#f1c7a5"/>
                            <path d="M-3.4 -17.4 Q-3.8 -11.6 0 -11 Q3.8 -11.6 3.4 -17.4 Q0 -15.6 -3.4 -17.4 Z" fill="#ffffff"/>
                            <circle cx="-1.1" cy="-18.2" r="0.4" fill="#212529"/>
                            <circle cx="1.1" cy="-18.2" r="0.4" fill="#212529"/>
                            <circle cx="0" cy="-17.2" r="0.7" fill="#e8a87c"/>
                            <path d="M-3.6 -19.4 Q-0.6 -25 5 -21.6 L6 -18.4 Z" fill="#e03131"/>
                            <rect x="-3.9" y="-20.2" width="7.8" height="1.7" rx="0.8" fill="#ffffff"/>
                            <circle cx="6.2" cy="-18.2" r="1.2" fill="#ffffff"/>
                        </g>
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

                    <!--epifania: la befana flying on her broom with a sack of gifts, and a stocking full of sweets-->
                    <g v-else-if="theme.id === 'epifania'">
                        <circle v-for="(st, i) in [[14, 14], [54, 30], [26, 8], [8, 30]]" :key="'es' + i" class="twinkle" :cx="st[0]" :cy="st[1]" r="1" fill="#ffe8a3" :style="delay(i, 1.8)"/>
                        <path d="M50 8 a8 8 0 1 0 6 13 a6.4 6.4 0 1 1 -6 -13 z" fill="#f5e6a8"/>
                        <g transform="translate(38 26) scale(0.95)">
                            <g class="witch">
                                <!--broom-->
                                <path d="M-11 2.4 L11 -0.6" stroke="#8b5a2b" stroke-width="1" stroke-linecap="round"/>
                                <path d="M-10.6 2.3 l-5.4 -2.6 l0.6 2.6 l-0.4 3 z" fill="#c69c3c"/>
                                <path d="M-11 2.4 l-4.4 -1.2 M-11 2.4 l-4.6 1.4" stroke="#8a6a1c" stroke-width="0.35"/>
                                <!--sack of gifts on her back-->
                                <ellipse cx="-4.6" cy="-6.4" rx="3.6" ry="3.2" fill="#a9825a"/>
                                <path d="M-2.4 -9 l1.4 -1.2" stroke="#6b4f3a" stroke-width="0.6" stroke-linecap="round"/>
                                <!--patched skirt and legs with old boots-->
                                <path d="M-2.2 -1.8 q-3.6 0.6 -6 3.4 q3.6 0.2 6.8 -1.8 z" fill="#3b2f2f"/>
                                <rect x="-5.4" y="-0.6" width="1.6" height="1.4" fill="#2f9e44" transform="rotate(-20 -4.6 0.1)"/>
                                <path d="M-0.4 -0.8 L5.6 0.2" stroke="#3b2f2f" stroke-width="1.3" stroke-linecap="round"/>
                                <path d="M5.2 -0.6 l2.2 0.1 l0.2 1.4 l-2.6 0 z" fill="#5c3d2e"/>
                                <!--shawl and an arm on the broom-->
                                <path d="M-1.2 -7.8 q3 0.2 2.6 3.2 q-0.2 1.8 0.6 3.2 h-5 q1 -2 0.2 -3.4 q-0.6 -2.6 1.6 -3 z" fill="#6b4f3a"/>
                                <rect x="-1.6" y="-5.4" width="1.6" height="1.4" fill="#e03131" transform="rotate(10 -0.8 -4.7)"/>
                                <path d="M0.6 -6.4 q2 1.4 3.6 4.4" stroke="#6b4f3a" stroke-width="1" fill="none" stroke-linecap="round"/>
                                <circle cx="4.3" cy="-1.9" r="0.6" fill="#e8c39e"/>
                                <!--face with a long nose and a red headscarf with white dots-->
                                <circle cx="0.6" cy="-9.4" r="1.7" fill="#e8c39e"/>
                                <path d="M2 -9.6 l1.6 0.6 l-1.5 0.4 z" fill="#d6a77a"/>
                                <path d="M-1.6 -9.2 q0 -3.6 2.4 -3.4 q2.2 0.2 2 2.4 q-1.2 -1 -2.4 -0.9 q-1 0.2 -1 2.8 l-1.4 0.4 z" fill="#c92a2a"/>
                                <path d="M-1.6 -9 l-1.8 1.2 l0.6 -1.8 z" fill="#c92a2a"/>
                                <circle cx="0" cy="-11.4" r="0.3" fill="#ffffff"/><circle cx="1.4" cy="-11.8" r="0.3" fill="#ffffff"/><circle cx="-0.8" cy="-10.2" r="0.3" fill="#ffffff"/>
                            </g>
                        </g>
                        <!--a stocking full of sweets swinging below-->
                        <g transform="translate(24 37)">
                            <g class="stocking">
                                <path d="M0 -7 v4" stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.6"/>
                                <circle cx="-1.6" cy="-2.6" r="1.2" fill="#ffd43b"/>
                                <circle cx="0.6" cy="-3" r="1.2" fill="#4dabf7"/>
                                <circle cx="2.4" cy="-2.4" r="1.1" fill="#f783ac"/>
                                <path d="M-3 -2 h6 v7 q0 2 2 2.6 l2.4 0.8 q1.6 0.6 1 2.2 q-0.6 1.4 -2.4 1 l-6 -1.6 q-3 -0.8 -3 -4 z" fill="#e03131"/>
                                <rect x="-3.4" y="-2.6" width="6.8" height="2.4" rx="0.6" fill="#ffffff"/>
                            </g>
                        </g>
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

                    <!--spring: a blossoming tree with falling petals, a meadow of tulips, daisies and a daffodil, butterflies, a swallow and drifting clouds-->
                    <g v-else-if="theme.id === 'spring'">
                        <!--clouds and a swallow, the persian sign of spring-->
                        <g class="cloud-drift"><ellipse cx="18" cy="12" rx="6" ry="2.6" fill="#ffffff" opacity="0.85"/><ellipse cx="21" cy="10.4" rx="3.4" ry="2.4" fill="#ffffff" opacity="0.85"/></g>
                        <g class="cloud-drift cloud-drift-late"><ellipse cx="38" cy="6" rx="4.6" ry="2" fill="#ffffff" opacity="0.7"/></g>
                        <g class="swallow">
                            <g class="swallow-wings">
                                <path d="M14 22 q-3.4 -3 -7 -1.6 q3.4 0.4 7 2.6 z" fill="#1f2a44"/>
                                <path d="M14 22 q3.4 -3 7 -1.6 q-3.4 0.4 -7 2.6 z" fill="#1f2a44"/>
                            </g>
                            <path d="M13.2 22.4 l-1.6 2.6 M14.8 22.4 l1.6 2.6" stroke="#1f2a44" stroke-width="0.6"/>
                            <ellipse cx="14" cy="22.4" rx="1.2" ry="1.6" fill="#1f2a44"/>
                            <circle cx="14" cy="23.2" r="0.6" fill="#e8590c"/>
                        </g>
                        <!--meadow-->
                        <path d="M-40 46 Q16 41 104 46 V170 H-40 Z" fill="#51cf66"/>
                        <path d="M-40 50 Q20 47 104 52 V170 H-40 Z" fill="#40c057"/>
                        <!--cherry blossom tree with petals drifting down-->
                        <path d="M48 47 Q47 38 46.6 31 M46.8 36 Q43 32 40 30 M47 34 Q51 30 54 29" stroke="#6b3e1f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                        <g class="blossom">
                            <circle v-for="(c, i) in [[46, 22, 7], [39, 26, 5], [54, 25, 5.4], [42, 18, 4.6], [51, 17, 5], [47, 29, 4]]" :key="'bc' + i" :cx="c[0]" :cy="c[1]" :r="c[2]" :fill="i % 2 ? '#fcc2d7' : '#f783ac'"/>
                            <circle v-for="(c, i) in [[44, 20], [49, 24], [40, 25], [53, 20], [46, 27], [42, 16]]" :key="'bf' + i" :cx="c[0]" :cy="c[1]" r="0.9" fill="#ffffff"/>
                        </g>
                        <g v-for="(pt, i) in [[40, 30], [48, 30], [54, 28], [44, 26], [36, 28]]" :key="'sp' + i" :transform="`translate(${pt[0]} ${pt[1]})`">
                            <ellipse class="petal" rx="0.9" ry="0.6" fill="#fcc2d7" :style="delay(i, 4.5)"/>
                        </g>
                        <!--flowers swaying in the meadow: tulips, daisies and a daffodil-->
                        <g v-for="(f, i) in [[10, 51, 'tulip', '#e03131'], [17, 49, 'daisy', '#ffffff'], [24, 52, 'tulip', '#ffd43b'], [31, 50, 'daffodil', '#ffd43b'], [37, 53, 'tulip', '#f783ac'], [57, 51, 'daisy', '#ffffff']]" :key="'fl' + i" :transform="`translate(${f[0]} ${f[1]})`">
                            <g class="flower-sway" :style="delay(i, 2.6)">
                                <path d="M0 0 V-8" stroke="#2b8a3e" stroke-width="0.9"/>
                                <path d="M0 -2 q-2.6 -1.6 -2.8 -4.6 q2 1.4 2.8 4.6 z" fill="#37b24d"/>
                                <path v-if="f[2] === 'tulip'" d="M-2.2 -8 Q-2.4 -12 -1.2 -12.4 L0 -11 L1.2 -12.4 Q2.4 -12 2.2 -8 Q0 -6.6 -2.2 -8 Z" :fill="f[3]"/>
                                <g v-else-if="f[2] === 'daisy'">
                                    <ellipse v-for="a in 8" :key="'dp' + a" cy="-10.4" rx="0.7" ry="1.7" :fill="f[3]" :transform="`rotate(${a * 45} 0 -8.6)`"/>
                                    <circle cy="-8.6" r="1" fill="#ffd43b"/>
                                </g>
                                <g v-else>
                                    <ellipse v-for="a in 6" :key="'df' + a" cy="-10.4" rx="1" ry="1.8" :fill="f[3]" :transform="`rotate(${a * 60} 0 -9)`"/>
                                    <circle cy="-9" r="1.2" fill="#f08c00"/>
                                </g>
                            </g>
                        </g>
                        <!--two butterflies-->
                        <g v-for="(b, i) in [[28, 30, '#74c0fc'], [36, 38, '#ffa94d']]" :key="'bt' + i" :transform="`translate(${b[0]} ${b[1]})`">
                            <g class="butterfly" :style="delay(i, 4)">
                                <g class="flap">
                                    <ellipse cx="-1.8" cy="0" rx="1.8" ry="1.4" :fill="b[2]"/>
                                    <ellipse cx="1.8" cy="0" rx="1.8" ry="1.4" :fill="b[2]"/>
                                    <ellipse cx="-1.4" cy="1.6" rx="1.1" ry="0.9" :fill="b[2]"/>
                                    <ellipse cx="1.4" cy="1.6" rx="1.1" ry="0.9" :fill="b[2]"/>
                                </g>
                                <ellipse cx="0" cy="0.6" rx="0.4" ry="1.6" fill="#343a40"/>
                            </g>
                        </g>
                    </g>

                    <!--summer: a cool sun with sunglasses over the sea and a beach with a parasol-->
                    <g v-else-if="theme.id === 'summer'">
                        <g transform="translate(10 -8)">
                            <g class="rays" stroke="#ffd43b" stroke-width="2.4" stroke-linecap="round">
                                <path v-for="a in 8" :key="'sr' + a" :transform="`rotate(${a * 45} 32 25)`" d="M32 8 v4"/>
                            </g>
                            <circle cx="32" cy="25" r="11" fill="#ffc72c"/>
                            <rect x="23.5" y="21.5" width="7.5" height="5" rx="2" fill="#212529"/>
                            <rect x="33" y="21.5" width="7.5" height="5" rx="2" fill="#212529"/>
                            <path d="M31 23 h2" stroke="#212529" stroke-width="1.2"/>
                            <path d="M28 30 q4 3 8 0" stroke="#b35a00" stroke-width="1.4" fill="none" stroke-linecap="round"/>
                        </g>
                        <path class="wave" d="M-32 46 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 v124 h-112 z" fill="#339af0"/>
                        <path class="wave wave-late" d="M-32 52 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 v118 h-112 z" fill="#1c7ed6"/>
                        <!--a sandy beach with a wet band along the water, beach and sea reach down to fill the corner on mobile-->
                        <path d="M-40 170 V44 Q10 37 26 45 Q38 52 44 70 L48 170 Z" fill="#e3b96b"/>
                        <path d="M-40 170 V46 Q10 40 24 47 Q35 54 40 70 L43 170 Z" fill="#f2d49b"/>
                        <circle cx="12" cy="55" r="0.7" fill="#d9b26a"/><circle cx="26" cy="60" r="0.7" fill="#d9b26a"/><circle cx="20" cy="62" r="0.7" fill="#d9b26a"/>
                        <path d="M22 50 L25 32" stroke="#8b5a2b" stroke-width="1.3" stroke-linecap="round"/>
                        <g class="parasol">
                            <path d="M13 34 Q25 22 37 34 Z" fill="#ff6b6b"/>
                            <path d="M21 32 Q25 25 25 25 Q25 25 29 32 Q25 30 21 32 Z" fill="#ffffff"/>
                            <path d="M13 34 Q16 32.4 19 34 Q22 32.4 25 34 Q28 32.4 31 34 Q34 32.4 37 34" fill="none" stroke="#c92a2a" stroke-width="0.7"/>
                        </g>
                        <circle cx="31" cy="56" r="2.6" fill="#ffffff"/>
                        <path d="M28.6 55 q2.4 1.2 4.8 -0.6" stroke="#4dabf7" stroke-width="0.9" fill="none"/>
                        <path d="M29.4 57.6 q1.8 0.8 3.6 -0.2" stroke="#ff6b6b" stroke-width="0.9" fill="none"/>
                    </g>

                    <!--autumn: golden poplar trees along a road covered with fallen leaves, poplar and maple leaves falling-->
                    <g v-else-if="theme.id === 'autumn'">
                        <path d="M-40 42 Q16 38 104 42 V170 H-40 Z" fill="#7a3e14"/>
                        <!--the road going into the distance, covered with leaves-->
                        <path d="M-30 170 L21 42 L29 42 L90 170 Z" fill="#5f5a55"/>
                        <path d="M25 45 v2.4 M24.6 50 v3 M24.2 56 v3.6" stroke="#d9d2c5" stroke-width="0.6" opacity="0.4"/>
                        <circle v-for="(d, i) in [[23, 44, '#f2b705'], [27, 45.4, '#e8590c'], [21.4, 48, '#c92a2a'], [28.4, 49, '#fab005'], [19.6, 52, '#e8890c'], [25.6, 51.4, '#f2b705'], [30.6, 53.6, '#d9480f'], [17.6, 56, '#fab005'], [23.4, 55, '#c92a2a'], [32.4, 57.6, '#f2b705'], [27.6, 58, '#e8590c'], [14.6, 59, '#d9480f']]" :key="'ar' + i" :cx="d[0]" :cy="d[1]" r="1.2" :fill="d[2]"/>
                        <circle v-for="(d, i) in [[6, 44, '#f2b705'], [12, 50, '#e8590c'], [40, 46, '#c92a2a'], [46, 52, '#f2b705'], [54, 48, '#e8890c'], [58, 55, '#fab005'], [8, 56, '#d9480f']]" :key="'ag' + i" :cx="d[0]" :cy="d[1]" r="1.5" :fill="d[2]"/>
                        <!--poplars, tall and narrow, swaying, the small one on the left is far away-->
                        <g class="poplar poplar-late">
                            <rect x="11.5" y="36" width="1" height="6.4" fill="#5c3d2e"/>
                            <ellipse cx="12" cy="30" rx="3" ry="7.4" fill="#f59f00"/>
                        </g>
                        <g class="poplar poplar-late">
                            <rect x="37.3" y="33" width="1.4" height="10" fill="#5c3d2e"/>
                            <ellipse cx="38" cy="24" rx="4.6" ry="10.6" fill="#e8890c"/>
                            <ellipse cx="36.6" cy="22.6" rx="1.9" ry="7.6" fill="#ffa94d" opacity="0.6"/>
                        </g>
                        <g class="poplar">
                            <rect x="48.2" y="28" width="1.8" height="15" fill="#5c3d2e"/>
                            <ellipse cx="49" cy="16" rx="6.4" ry="14" fill="#f2b705"/>
                            <ellipse cx="47" cy="14" rx="2.8" ry="10" fill="#ffd43b" opacity="0.6"/>
                        </g>
                        <!--falling leaves, poplar leaves are the golden triangular ones with a stem-->
                        <g v-for="(l, i) in [[44, 12, 'poplar', '#fab005'], [30, 18, 'maple', '#e03131'], [54, 18, 'poplar', '#f59f00'], [22, 12, 'maple', '#e8590c'], [40, 24, 'poplar', '#ffd43b'], [16, 22, 'maple', '#c92a2a']]" :key="'al' + i" :transform="`translate(${l[0]} ${l[1]}) scale(0.8)`">
                            <g class="leaf" :style="delay(i, 5)">
                                <template v-if="l[2] === 'poplar'">
                                    <path d="M0 -5.4 Q1.8 -2.2 4.6 1.6 Q4 4.2 0 3.8 Q-4 4.2 -4.6 1.6 Q-1.8 -2.2 0 -5.4 Z" :fill="l[3]" stroke="#a66a00" stroke-width="0.4"/>
                                    <path d="M0 -4.6 V6.4" stroke="#a66a00" stroke-width="0.5"/>
                                </template>
                                <template v-else>
                                    <path d="M0 -5 L1.2 -2.2 L3.6 -3.2 L2.8 -0.6 L5 0.4 L2.4 1.6 L3 3.6 L0.6 2.6 L0 5 L-0.6 2.6 L-3 3.6 L-2.4 1.6 L-5 0.4 L-2.8 -0.6 L-3.6 -3.2 L-1.2 -2.2 Z" :fill="l[3]"/>
                                    <path d="M0 2.6 v3.4" stroke="#7a2e0e" stroke-width="0.5"/>
                                </template>
                            </g>
                        </g>
                    </g>

                    <!--winter: a swaying snowman in falling snow-->
                    <g v-else-if="theme.id === 'winter'">
                        <circle v-for="(x, i) in [8, 20, 44, 56, 14, 50]" :key="'ws' + i" class="snowfall" :cx="x" cy="4" r="1.2" fill="#ffffff" :style="delay(i, 3.5)"/>
                        <path d="M-40 58 Q32 50 104 58 V170 H-40 Z" fill="#e9f2ff"/>
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
                        <!--snowballs: one hits the snowman and bursts, two fly high over the top of his hat to the other side-->
                        <g v-for="(b, i) in [[4, 48, 'snowball-left'], [60, 46, 'snowball-over-left'], [4, 47, 'snowball-over-right']]" :key="'sb' + i" :transform="`translate(${b[0]} ${b[1]})`">
                            <circle :class="b[2]" r="1.7" fill="#ffffff" stroke="#c5d4f0" stroke-width="0.35"/>
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
    </Teleport>
</template>

<script>
import { themeFor, toPersian } from '../seasonal.js';
import { preview, previewDate } from '../preview.js';


const LABELS = {
    yalda: 'Happy Yalda Night · شب یلدا ',
    suri: 'Happy Chaharshanbe Suri · چهارشنبه‌سوری ',
    nowruz: 'Happy Nowruz · نوروز پیروز',
    sizdah: 'Happy Sizdah Bedar · سیزده‌بدر',
    easter: 'Happy Easter · Buona Pasqua',
    halloween: 'Happy Halloween',
    thanksgiving: 'Happy Thanksgiving',
    christmas: 'Merry Christmas',
    newyear: 'Happy New Year',
    epifania: 'Buona Epifania · La Befana',
    valentine: "Happy Valentine's Day",
    stpatrick: "Happy St. Patrick's Day",
    spring: 'Spring · بهار',
    summer: 'Summer · تابستان',
    autumn: 'Autumn · پاییز',
    winter: 'Winter · زمستان'
};
const BACKGROUNDS = {
    yalda: '#2a1630', suri: '#2b1a12', nowruz: '#14301f', sizdah: '#1c3a4a', easter: '#1d3324', halloween: '#24162e', thanksgiving: '#2e2112',
    christmas: '#10261a', newyear: '#101a33', epifania: '#16213e', valentine: '#33121f', stpatrick: '#11291a',
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
.ghost {
    animation: ghost 2.6s ease-in-out infinite;
}
.witch {
    animation: witch 3.2s ease-in-out infinite alternate;
}
.cloud-drift {
    animation: drift 5s ease-in-out infinite alternate;
}
.cloud-drift-late {
    animation-duration: 7s;
    animation-direction: alternate-reverse;
}
.swallow {
    animation: swallow 6s ease-in-out infinite;
}
.swallow-wings {
    animation: flap 0.35s ease-in-out infinite alternate;
}
.blossom {
    transform-origin: 50% 100%;
    animation: sway 3.4s ease-in-out infinite alternate;
}
.petal {
    animation: petal 4.5s ease-in infinite;
}
.flower-sway {
    transform-origin: 50% 100%;
    animation: sway 2.6s ease-in-out infinite alternate;
}
@keyframes swallow {
    0% { transform: translate(-6px, 2px); }
    25% { transform: translate(4px, -3px); }
    50% { transform: translate(12px, 1px); }
    75% { transform: translate(4px, 4px); }
    100% { transform: translate(-6px, 2px); }
}
@keyframes petal {
    0% { transform: translate(0, 0) rotate(0); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translate(-8px, 22px) rotate(300deg); opacity: 0; }
}
.snowball-left {
    animation: snowball-left 2.6s ease-in infinite;
}
.snowball-over-left {
    animation: snowball-over-left 3.2s linear infinite;
    animation-delay: -1.1s;
}
.snowball-over-right {
    animation: snowball-over-right 3.2s linear infinite;
    animation-delay: -2.3s;
}
@keyframes snowball-left {
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    6% { opacity: 1; }
    45% { transform: translate(10px, -14px) scale(1); }
    82% { transform: translate(20px, -8px) scale(1); opacity: 1; }
    90% { transform: translate(20.5px, -8px) scale(1.9); opacity: 0.5; }
    100% { transform: translate(20.5px, -8px) scale(2.2); opacity: 0; }
}
/* high arcs over the top of the snowman's hat */
@keyframes snowball-over-left {
    0% { transform: translate(0, 0); opacity: 0; }
    6% { opacity: 1; }
    25% { transform: translate(-14px, -30px); }
    50% { transform: translate(-28px, -40px); }
    75% { transform: translate(-42px, -30px); }
    94% { opacity: 1; }
    100% { transform: translate(-56px, 0); opacity: 0; }
}
@keyframes snowball-over-right {
    0% { transform: translate(0, 0); opacity: 0; }
    6% { opacity: 1; }
    25% { transform: translate(14px, -29px); }
    50% { transform: translate(28px, -39px); }
    75% { transform: translate(42px, -29px); }
    94% { opacity: 1; }
    100% { transform: translate(56px, 1px); opacity: 0; }
}
@keyframes ghost {
    0%, 100% { transform: translate(0, 0) rotate(-4deg); opacity: 0.95; }
    50% { transform: translate(1.5px, -3px) rotate(4deg); opacity: 0.7; }
}
.kite {
    transform-origin: 50% 100%;
    animation: sway 2.2s ease-in-out infinite alternate;
}
.ripple {
    animation: ripple 1.6s linear infinite;
}
.ripple-late {
    animation-duration: 2.2s;
}
.sabzeh-float {
    animation: sabzeh-float 7s linear infinite;
}
.steam {
    animation: steam 2s ease-out infinite;
}
@keyframes ripple {
    to { stroke-dashoffset: -10; }
}
/* follows the stream from the back to the front */
@keyframes sabzeh-float {
    0% { transform: translate(10px, 40px) scale(0.6); opacity: 0; }
    8% { opacity: 1; }
    35% { transform: translate(24px, 48px) scale(0.8) rotate(8deg); }
    65% { transform: translate(32px, 57px) scale(0.95) rotate(-6deg); }
    92% { opacity: 1; }
    100% { transform: translate(46px, 65px) scale(1.1) rotate(6deg); opacity: 0; }
}
@keyframes steam {
    0% { transform: translateY(1px); opacity: 0; }
    30% { opacity: 0.8; }
    100% { transform: translateY(-3px); opacity: 0; }
}
.volleyball {
    animation: volleyball 1.6s ease-in-out infinite alternate;
}
.jump-left {
    animation: jump-left 3.2s ease-in-out infinite;
}
.jump-right {
    animation: jump-right 3.2s ease-in-out infinite;
}
.grill-smoke {
    animation: steam 2.2s ease-out infinite;
}
.grill-smoke-late {
    animation-delay: -1.1s;
}
.coals {
    animation: candle 1s ease-in-out infinite;
}
/* the ball flies in an arc over the net from one player to the other and back */
@keyframes volleyball {
    0% { transform: translate(0, 0); }
    25% { transform: translate(5.5px, -5px); }
    50% { transform: translate(11px, -6.6px); }
    75% { transform: translate(16.5px, -5px); }
    100% { transform: translate(22px, 0); }
}
@keyframes jump-left {
    0%, 100% { transform: translateY(-2px); }
    12%, 88% { transform: translateY(0); }
}
@keyframes jump-right {
    0%, 38%, 62%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
}
.santa-wave {
    transform-origin: 0% 100%;
    animation: santa-wave 0.9s ease-in-out infinite alternate;
}
.poplar {
    transform-origin: 50% 100%;
    animation: sway 3s ease-in-out infinite alternate;
}
.poplar-late {
    animation-delay: -1.4s;
}
.hop {
    animation: hop 1.4s ease-in-out infinite;
}
.peek {
    animation: peek 2.4s ease-in-out infinite;
}
@keyframes santa-wave {
    from { transform: rotate(-12deg); }
    to { transform: rotate(18deg); }
}
@keyframes hop {
    0%, 60%, 100% { transform: translateY(0) scaleY(1); }
    20% { transform: translateY(-5px) scaleY(1.04); }
    40% { transform: translateY(0) scaleY(0.95); }
}
@keyframes peek {
    0%, 100% { transform: translateY(3px); }
    40%, 70% { transform: translateY(0); }
}
.stocking {
    transform-origin: 50% 0;
    animation: sway 1.6s ease-in-out infinite alternate;
}
.hair {
    transform-origin: 100% 50%;
    animation: sway 0.6s ease-in-out infinite alternate;
}
/* she loops in front of the moon so she always stays inside the corner */
@keyframes witch {
    0% { transform: translate(-4px, 1.5px) rotate(4deg); }
    50% { transform: translate(1px, -2.5px) rotate(-2deg); }
    100% { transform: translate(4px, 0.5px) rotate(-5deg); }
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
