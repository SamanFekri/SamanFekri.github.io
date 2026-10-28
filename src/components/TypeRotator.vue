<template>
    <!--types each item, holds it so it can be read, erases it and moves to the next one, after one round it rests on the first item-->
    <p class="type-rotator" :class="{ done }" aria-live="off">
        <span class="sr-only">{{ items.join(', ') }}</span>
        <span aria-hidden="true">{{ shown }}<span class="cursor">▍</span></span>
    </p>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        typeSpeed: { type: Number, default: 70 },
        eraseSpeed: { type: Number, default: 35 },
        hold: { type: Number, default: 2000 }
    },
    data() {
        return {
            index: 0,
            shown: '',
            done: false,
            timer: null
        }
    },
    methods: {
        later(ms, fn) {
            this.timer = setTimeout(fn, ms);
        },
        type() {
            const word = this.items[this.index];
            if (this.shown.length < word.length) {
                this.shown = word.slice(0, this.shown.length + 1);
                this.later(this.typeSpeed, this.type);
            } else if (this.finishing) {
                // one full round is enough, it rests on the first item
                this.done = true;
            } else {
                this.later(this.hold, this.erase);
            }
        },
        erase() {
            if (this.shown.length > 0) {
                this.shown = this.shown.slice(0, -1);
                this.later(this.eraseSpeed, this.erase);
            } else {
                this.index = (this.index + 1) % this.items.length;
                if (this.index === 0) this.finishing = true;
                this.later(300, this.type);
            }
        }
    },
    mounted() {
        if (!this.items.length) return;
        // reduced motion: no typing, just the first item
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.shown = this.items[0];
            return;
        }
        this.type();
    },
    beforeUnmount() {
        clearTimeout(this.timer);
    }
}
</script>

<style scoped>
.type-rotator {
    min-height: 1.5em;
}
.done .cursor {
    display: none;
}
.cursor {
    margin-left: 1px;
    color: #3a7ff5;
    animation: blink 1s step-end infinite;
}
@keyframes blink {
    50% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
    .cursor {
        display: none;
    }
}
</style>
