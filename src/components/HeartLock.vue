<template>
    <!--a challenge to unlock my heart: the right secret phrase opens a message meant only for the one who knows it-->
    <!--fixed at the bottom left of the screen, on mobile just above the tab bar-->
    <!--it fades away after 20 seconds, but never while the mouse is on it or the challenge is open-->
    <Transition name="cta">
        <button v-if="vault && showButton" type="button" class="heart-cta fixed z-30 left-3 bottom-[68px] md:left-4 md:bottom-4 flex items-center gap-2 rounded-full pl-2 pr-4 py-1.5 text-white text-sm font-bold" @click="openDialog" @mouseenter="hovering = true" @mouseleave="hovering = false; tryHide()">
            <svg class="cta-heart w-8 h-8 shrink-0" viewBox="0 0 120 140" aria-hidden="true">
                <path d="M38 58 V40 a22 22 0 0 1 44 0 V58" fill="none" stroke="#ffd43b" stroke-width="9" stroke-linecap="round"/>
                <path :d="heartPath" fill="#e64980" stroke="#ffd43b" stroke-width="4"/>
                <circle cx="60" cy="86" r="7" fill="#2b0a14"/>
                <path d="M56 88 h8 l-2 16 h-4 z" fill="#2b0a14"/>
            </svg>
            <span>Unlock my heart?</span>
        </button>
    </Transition>

    <Teleport to="body">
        <Transition name="fade">
            <div v-if="open" class="heart-overlay fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
                <div class="relative w-full max-w-sm text-center text-white" role="dialog" aria-modal="true" aria-label="Unlock my heart">
                    <button type="button" class="absolute -top-2 right-0 text-2xl opacity-70 hover:opacity-100 p-2" aria-label="Close" @click="close">×</button>

                    <svg class="lock mx-auto w-48 h-56 overflow-visible" :class="[`phase-${phase}`, { shake }]" viewBox="0 0 120 140" aria-hidden="true">
                        <defs>
                            <linearGradient id="heart-fill" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stop-color="#f06595"/>
                                <stop offset="1" stop-color="#c2255c"/>
                            </linearGradient>
                            <radialGradient id="heart-light"><stop offset="0" stop-color="#fff3bf" stop-opacity="0.95"/><stop offset="1" stop-color="#fff3bf" stop-opacity="0"/></radialGradient>
                        </defs>
                        <!--light shining out when the heart opens-->
                        <circle class="inner-light" cx="60" cy="92" r="44" fill="url(#heart-light)"/>
                        <path class="shackle" d="M38 58 V40 a22 22 0 0 1 44 0 V58" fill="none" stroke="#ffd43b" stroke-width="9" stroke-linecap="round"/>
                        <g class="half half-left">
                            <path d="M60 132 C30 112 14 96 14 76 C14 62 25 52 38 52 C48 52 55 57 60 64 Z" fill="url(#heart-fill)" stroke="#ffd43b" stroke-width="3"/>
                        </g>
                        <g class="half half-right">
                            <path d="M60 64 C65 57 72 52 82 52 C95 52 106 62 106 76 C106 96 90 112 60 132 Z" fill="url(#heart-fill)" stroke="#ffd43b" stroke-width="3"/>
                        </g>
                        <!--the keyhole glows brighter while typing-->
                        <g class="keyhole" :style="{ filter: `drop-shadow(0 0 ${2 + glow * 6}px rgb(255 212 59 / ${0.2 + glow * 0.7}))` }">
                            <circle cx="60" cy="86" r="7" fill="#2b0a14"/>
                            <path d="M56 88 h8 l-2 16 h-4 z" fill="#2b0a14"/>
                        </g>
                        <!--golden key that slides in and turns-->
                        <g class="key">
                            <circle cx="0" cy="0" r="6" fill="none" stroke="#ffd43b" stroke-width="3"/>
                            <path d="M6 0 h20 M20 0 v5 M25 0 v4" stroke="#ffd43b" stroke-width="3" stroke-linecap="round"/>
                        </g>
                        <!--burst when it opens: sparkles and hearts, or silver stars for "always"-->
                        <g v-if="burst" class="burst">
                            <g v-for="(p, i) in particles" :key="'p' + i" :style="{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animationDelay: `${p.delay}s` }" class="particle">
                                <path v-if="p.kind === 'heart'" transform="translate(-6 -6) scale(0.2)" :d="heartPath" :fill="p.color"/>
                                <path v-else d="M0 -4 l1.2 2.8 l2.8 1.2 l-2.8 1.2 l-1.2 2.8 l-1.2 -2.8 l-2.8 -1.2 l2.8 -1.2 z" :fill="p.color"/>
                            </g>
                        </g>
                    </svg>

                    <!--before it opens: the challenge-->
                    <div v-if="!opened">
                        <h2 class="text-2xl font-bold mt-2">Can you unlock my heart?</h2>
                        <p class="text-sm opacity-70 mb-4">Whisper the secret phrase. Only one opens it.</p>
                        <form class="flex gap-2" @submit.prevent="tryPhrase">
                            <input ref="input" v-model="phrase" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                                class="flex-1 min-w-0 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-30 px-3 py-2 text-white placeholder-white placeholder-opacity-40 focus:outline-none focus:border-opacity-70"
                                placeholder="the secret phrase…" :disabled="busy || waitSeconds > 0" aria-label="Secret phrase">
                            <button type="submit" class="rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-40 px-4 py-2 font-bold" :disabled="busy || waitSeconds > 0 || !phrase.trim()">
                                {{ busy ? '…' : 'Unlock' }}
                            </button>
                        </form>
                        <p class="text-sm mt-3 min-h-[1.25rem]" aria-live="polite">
                            <span v-if="waitSeconds > 0" class="text-yellow-300">The lock needs a rest. Try again in {{ waitText }}.</span>
                            <span v-else-if="wrong" class="text-pink-300">Not this key 🙂</span>
                        </p>
                    </div>

                    <!--after it opens: the letter-->
                    <div v-else class="letter mx-auto mt-2 rounded-xl px-5 py-4 text-left whitespace-pre-line" :class="message.mood === 'always' ? 'letter-always' : 'letter-sparkle'" aria-live="polite">
                        {{ typed }}<span v-if="typed.length < message.text.length" class="caret">|</span>
                    </div>

                    <!--a silver doe runs across for "always"-->
                    <svg v-if="opened && message.mood === 'always'" class="doe absolute left-0 bottom-0 w-16 h-12" viewBox="0 0 40 30" aria-hidden="true">
                        <g fill="#e3fafc" opacity="0.9">
                            <ellipse cx="18" cy="16" rx="9" ry="5"/>
                            <path d="M25 14 L30 6 L33 7 L28 16 Z"/>
                            <ellipse cx="32" cy="6" rx="3.4" ry="2.2"/>
                            <path d="M31 4 L30 0 L32 3 Z M33.4 4 L34 0.4 L34.6 3.6 Z"/>
                            <path d="M11 19 L8 28 M14 20 L13 28 M22 20 L24 28 M25 19 L28 27" stroke="#e3fafc" stroke-width="1.6" stroke-linecap="round"/>
                        </g>
                    </svg>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script>
import { unlock, lockState, recordFailure, recordSuccess } from '../hearts.js';

// for now the floating button is hidden, the lock opens by clicking "Birthday" in the sidebar three times
const SHOW_BUTTON = false;

export default {
    data() {
        return {
            vault: null,
            open: false,
            showButton: SHOW_BUTTON,
            hovering: false,
            expired: false,
            phrase: '',
            busy: false,
            wrong: false,
            shake: false,
            phase: 'idle',
            opened: false,
            burst: false,
            message: null,
            typed: '',
            waitSeconds: 0,
            timers: [],
            heartPath: 'M60 132 C30 112 14 96 14 76 C14 62 25 52 38 52 C48 52 55 57 60 64 C65 57 72 52 82 52 C95 52 106 62 106 76 C106 96 90 112 60 132 Z'
        }
    },
    computed: {
        // the keyhole glows a bit more with every letter typed
        glow() {
            return Math.min(this.phrase.trim().length / 14, 1);
        },
        waitText() {
            const m = Math.floor(this.waitSeconds / 60), s = this.waitSeconds % 60;
            return `${m}:${String(s).padStart(2, '0')}`;
        },
        particles() {
            const always = this.message && this.message.mood === 'always';
            const colors = always ? ['#e3fafc', '#c5f6fa', '#ffffff'] : ['#ffd43b', '#ff8fab', '#ffffff', '#f06595'];
            return Array.from({ length: always ? 14 : 22 }, (_, i) => {
                const angle = (i / (always ? 14 : 22)) * Math.PI * 2;
                const distance = always ? 30 + (i % 3) * 10 : 45 + (i % 4) * 14;
                return {
                    kind: !always && i % 3 === 0 ? 'heart' : 'star',
                    color: colors[i % colors.length],
                    // "always" stars drift down softly, sparkles burst out in every direction
                    dx: Math.round(Math.cos(angle) * distance),
                    dy: always ? 30 + (i % 5) * 9 : Math.round(Math.sin(angle) * distance),
                    delay: always ? (i % 7) * 0.18 : (i % 5) * 0.04
                };
            });
        }
    },
    methods: {
        later(ms, fn) {
            this.timers.push(setTimeout(fn, ms));
        },
        openDialog() {
            this.open = true;
            // the overlay covers the button, so the mouse never "leaves" it
            this.hovering = false;
            this.updateWait();
            this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
        },
        tryHide() {
            if (this.expired && !this.open && !this.hovering) this.showButton = false;
        },
        close() {
            this.open = false;
            this.timers.forEach(clearTimeout);
            this.timers = [];
            this.$nextTick(this.tryHide);
            Object.assign(this, { phrase: '', wrong: false, shake: false, phase: 'idle', opened: false, burst: false, message: null, typed: '', busy: false });
        },
        updateWait() {
            const left = Math.ceil((lockState().until - Date.now()) / 1000);
            this.waitSeconds = Math.max(left, 0);
        },
        async tryPhrase() {
            this.updateWait();
            if (this.busy || this.waitSeconds > 0 || !this.phrase.trim()) return;
            this.busy = true;
            this.wrong = false;
            const started = Date.now();
            const found = await unlock(this.phrase, this.vault).catch(() => null);
            // a switched off message answers exactly like a wrong phrase
            const message = found && found.enabled !== false ? found : null;
            // every answer takes at least a second, so guessing is slow
            await new Promise(r => setTimeout(r, Math.max(0, 1000 - (Date.now() - started))));
            this.busy = false;
            if (!message) {
                recordFailure();
                this.updateWait();
                this.wrong = true;
                this.shake = true;
                this.later(600, () => { this.shake = false; });
                return;
            }
            recordSuccess();
            this.message = message;
            this.playOpening();
        },
        playOpening() {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reducedMotion) {
                this.phase = 'split';
                this.opened = true;
                this.typed = this.message.text;
                return;
            }
            // key slides in, turns, the shackle pops, the heart splits, then the letter types itself
            this.phase = 'key';
            this.later(700, () => { this.phase = 'turn'; });
            this.later(1200, () => { this.phase = 'unlocked'; });
            this.later(1700, () => { this.phase = 'split'; this.burst = true; });
            this.later(2300, () => { this.opened = true; this.typeLetter(0); });
        },
        typeLetter(i) {
            const chars = Array.from(this.message.text);
            this.typed = chars.slice(0, i).join('');
            if (i < chars.length) this.later(chars[i - 1] === '\n' ? 260 : 32, () => this.typeLetter(i + 1));
        },
        openFromSecret() {
            if (this.vault && !this.open) this.openDialog();
        },
        onKey(event) {
            if (event.key === 'Escape' && this.open) this.close();
        }
    },
    mounted() {
        fetch('./data/hearts.json')
            .then(response => (response.ok ? response.json() : null))
            .then(vault => { this.vault = vault; })
            .catch(() => { this.vault = null; });
        window.addEventListener('keydown', this.onKey);
        window.addEventListener('open-heart-lock', this.openFromSecret);
        this.waitTimer = setInterval(() => { if (this.open) this.updateWait(); }, 1000);
        this.hideTimer = setTimeout(() => { this.expired = true; this.tryHide(); }, 20000);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.onKey);
        window.removeEventListener('open-heart-lock', this.openFromSecret);
        clearInterval(this.waitTimer);
        clearTimeout(this.hideTimer);
        this.timers.forEach(clearTimeout);
    }
}
</script>

<style scoped>
.heart-cta {
    background: linear-gradient(135deg, rgb(120 20 60 / 0.92), rgb(60 20 40 / 0.92));
    box-shadow: 0 4px 14px rgb(0 0 0 / 0.4);
    border: 1px solid rgb(240 101 149 / 0.6);
    transition: transform 200ms ease-out, border-color 200ms ease-out;
    -webkit-tap-highlight-color: transparent;
}
.cta-enter-active, .cta-leave-active {
    transition: opacity 600ms ease-out, transform 600ms ease-out;
}
.cta-enter-from, .cta-leave-to {
    opacity: 0;
    transform: translateX(-24px);
}
.heart-cta:hover {
    transform: translateY(-1px);
    border-color: rgb(240 101 149 / 1);
}
.cta-heart {
    animation: beat 1.4s ease-in-out infinite;
}
.heart-overlay {
    background: rgb(10 5 10 / 0.8);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
}
.lock * {
    transform-box: fill-box;
}
.lock {
    animation: float 3s ease-in-out infinite;
}
.lock.shake {
    animation: shake 0.5s ease-in-out;
}
.keyhole {
    transition: filter 200ms ease-out;
}
.shackle {
    transform-origin: 100% 100%;
    transition: transform 400ms cubic-bezier(.3, 1.6, .5, 1);
}
.key {
    transform: translate(150px, 86px);
    opacity: 0;
    transition: transform 600ms cubic-bezier(.2, .8, .2, 1), opacity 300ms ease-out;
}
.half {
    transition: transform 700ms cubic-bezier(.2, .8, .2, 1);
}
.half-left {
    transform-origin: 100% 100%;
}
.half-right {
    transform-origin: 0% 100%;
}
.inner-light {
    opacity: 0;
    transform-origin: center;
    transition: opacity 600ms ease-out, transform 800ms ease-out;
    transform: scale(0.4);
}
/* the opening, step by step */
.phase-key .key, .phase-turn .key, .phase-unlocked .key {
    transform: translate(86px, 86px);
    opacity: 1;
}
.phase-turn .key, .phase-unlocked .key {
    transform: translate(86px, 86px) rotate(90deg);
}
.phase-unlocked .shackle, .phase-split .shackle {
    transform: translateY(-12px) rotate(-25deg);
}
.phase-split .key {
    opacity: 0;
    transform: translate(86px, 86px) rotate(90deg);
}
.phase-split .half-left {
    transform: translate(-14px, 6px) rotate(-22deg);
}
.phase-split .half-right {
    transform: translate(14px, 6px) rotate(22deg);
}
.phase-split .keyhole {
    opacity: 0;
    transition: opacity 200ms ease-out;
}
.phase-split .inner-light {
    opacity: 1;
    transform: scale(1);
}
.particle {
    transform: translate(60px, 90px);
    animation: particle 1.4s ease-out forwards;
    opacity: 0;
}
.letter {
    max-width: 22rem;
    line-height: 1.6;
    animation: unfold 500ms ease-out both;
    transform-origin: top;
}
.letter-sparkle {
    background: linear-gradient(160deg, #fff5f7, #ffe3ec);
    color: #5c1a33;
    box-shadow: 0 10px 30px rgb(230 73 128 / 0.35);
}
.letter-always {
    background: linear-gradient(160deg, #1b2533, #101820);
    color: #e3fafc;
    border: 1px solid rgb(197 246 250 / 0.35);
    box-shadow: 0 10px 30px rgb(197 246 250 / 0.15);
}
.caret {
    animation: blink 0.8s step-end infinite;
}
.doe {
    animation: doe 4s ease-in-out forwards;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 250ms ease-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
@keyframes beat {
    0%, 40%, 100% { transform: scale(1); }
    15% { transform: scale(1.12); }
    28% { transform: scale(1.03); }
}
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px) rotate(-4deg); }
    40% { transform: translateX(9px) rotate(3deg); }
    60% { transform: translateX(-6px) rotate(-2deg); }
    80% { transform: translateX(4px); }
}
@keyframes particle {
    0% { transform: translate(60px, 90px) scale(0.4); opacity: 0; }
    15% { opacity: 1; }
    100% { transform: translate(calc(60px + var(--dx)), calc(90px + var(--dy))) scale(1.2); opacity: 0; }
}
@keyframes unfold {
    from { transform: scaleY(0.2); opacity: 0; }
    to { transform: scaleY(1); opacity: 1; }
}
@keyframes blink {
    50% { opacity: 0; }
}
@keyframes doe {
    0% { transform: translateX(-20%); opacity: 0; }
    15% { opacity: 0.9; }
    85% { opacity: 0.9; }
    100% { transform: translateX(560%); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
    .cta-heart, .lock, .particle, .doe, .caret {
        animation: none !important;
    }
    .lock *, .letter {
        transition: none !important;
        animation: none !important;
    }
}
</style>
