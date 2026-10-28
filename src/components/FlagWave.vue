<template>
    <!--the flag is cut into thin vertical slices, each slice moves up and down a bit later than the previous one so it looks like waving cloth-->
    <span class="flag" role="img" :aria-label="label" :style="cssVars">
        <span v-for="i in slices" :key="'slice-' + i" class="slice"
            :style="{ backgroundImage: `url(${src})`, backgroundPosition: `${-(i - 1) * sliceWidth}px 0`, animationDelay: `${-(i - 1) * 0.09}s` }"></span>
    </span>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 27
        },
        height: {
            type: Number,
            default: 18
        },
        slices: {
            type: Number,
            default: 9
        }
    },
    computed: {
        sliceWidth() {
            return this.width / this.slices;
        },
        cssVars() {
            return {
                '--width': `${this.width}px`,
                '--height': `${this.height}px`,
                '--slice-width': `${this.sliceWidth}px`
            }
        }
    }
}
</script>

<style scoped>
.flag {
    display: inline-flex;
    vertical-align: middle;
    width: var(--width);
    height: var(--height);
    margin: 0 0.4rem 0 0;
}
.slice {
    display: block;
    width: var(--slice-width);
    height: 100%;
    background-size: var(--width) var(--height);
    background-repeat: no-repeat;
    /* wave twice when the page loads, then rest, and wave again while hovered */
    animation: wave 1.4s ease-in-out 4 alternate;
}
li:hover .slice, .flag:hover .slice {
    animation-iteration-count: infinite;
}
.slice:first-child {
    border-radius: 2px 0 0 2px;
}
.slice:last-child {
    border-radius: 0 2px 2px 0;
}
@keyframes wave {
    from {
        transform: translateY(-1.2px);
        filter: brightness(1.12);
    }
    to {
        transform: translateY(1.2px);
        filter: brightness(0.82);
    }
}
@media (prefers-reduced-motion: reduce) {
    .slice {
        animation: none;
    }
}
</style>
