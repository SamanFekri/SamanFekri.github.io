<template>
    <div class="p-1">
        <div class="w-full h-full outer overflow-hidden" :style="cssVars">
            <div class="w-full h-full inner overflow-hidden">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BorderGradiantBox',
    props: {
        cardColor: {
            type: String,
            default: '#181818'
        },
        startDegree: {
            type: Number,
            default: 45
        },
        centerColor: {
            type: String,
            default: '#f3f3f3'
        },
        leftColor: {
            type: String,
            default: '#202020'
        },
        rightColor: {
            type: String,
            default: '#202020'
        },
        borderSize: {
            type: String,
            default: '1px'
        },
        borderRadius: {
            type: String,
            default: '5px'
        },
        onHoverAnimation: {
            type: Boolean,
            default: true
        },
        animationDuration: {
            type: Number,
            default: 3
        },
        alwaysAnimation: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            degree: this.startDegree,
            animationInterval: null
        }
    },
    computed: {
        cssVars() {
            return {
                '--center-color': this.centerColor,
                '--left-color': this.leftColor,
                '--right-color': this.rightColor,
                '--border-size': this.borderSize,
                '--border-radius': this.borderRadius,
                '--card-color': this.cardColor,
                '--degree': `${this.degree}deg`,
            }
        }
    },
    mounted() {
        if (this.alwaysAnimation) {
            this.startAnimation();
        } else if (this.onHoverAnimation) {
            this.$el.addEventListener('mouseenter', this.startAnimation);
            this.$el.addEventListener('mouseleave', this.stopAnimation);
        }
    },
    methods: {
        startAnimation() {
            let sleepTime = parseInt(this.animationDuration) * 1000 / 360;
            this.animationInterval = setInterval(() => {
                this.degree = `${(parseInt(this.degree) + 1) % 360}`;
            }, sleepTime)
        },
        stopAnimation() {
            clearInterval(this.animationInterval);
        },
    }
}
</script>

<style scoped>
.outer {
    padding: var(--border-size);
    background: linear-gradient(var(--degree), var(--left-color), var(--center-color), var(--right-color));
    border-radius: var(--border-radius);
}
.inner {
    background: var(--card-color);
    border-radius: var(--border-radius);
}
</style>