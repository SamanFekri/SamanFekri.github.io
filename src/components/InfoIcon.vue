<template>
    <!--small animated icons for the contact details in the sidebar, outlines use currentColor like the other icons-->
    <svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true">
        <!--email: the flap opens and a letter peeks out-->
        <g v-if="name === 'email'">
            <rect class="letter" x="6" y="7" width="12" height="9" rx="1" fill="#f3f3f3"/>
            <path class="letter" d="M8 9.6 h8 M8 11.6 h6" stroke="#adb5bd" stroke-width="0.9" stroke-linecap="round"/>
            <rect x="3" y="9" width="18" height="11" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8"/>
            <path d="M3.6 19.4 L10 14 M20.4 19.4 L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <path class="flap" d="M3.4 9.6 L12 15.6 L20.6 9.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        </g>
        <!--phone: a short ring with signal waves on both sides-->
        <g v-else-if="name === 'phone'">
            <path class="wave wave-1" d="M4.6 8.6 q-1.6 3.4 0 6.8 M19.4 8.6 q1.6 3.4 0 6.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <path class="wave wave-2" d="M2.2 6.8 q-2.6 5.2 0 10.4 M21.8 6.8 q2.6 5.2 0 10.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <g class="ring">
                <rect x="7.4" y="3" width="9.2" height="18" rx="2.2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.8"/>
                <path d="M10.6 5.6 h2.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                <circle cx="12" cy="18" r="1" fill="currentColor"/>
            </g>
        </g>
        <!--birthday: a cake with flickering candles and twinkling sprinkles-->
        <g v-else-if="name === 'birthday'">
            <g fill="#ffd43b">
                <path class="flame" d="M8 3.2 c1 1.4 1 2.4 0 3 c-1 -0.6 -1 -1.6 0 -3 z"/>
                <path class="flame flame-2" d="M12 2.6 c1 1.4 1 2.4 0 3 c-1 -0.6 -1 -1.6 0 -3 z"/>
                <path class="flame flame-3" d="M16 3.2 c1 1.4 1 2.4 0 3 c-1 -0.6 -1 -1.6 0 -3 z"/>
            </g>
            <path d="M8 6.6 v3 M12 6 v3.6 M16 6.6 v3" stroke="#f3f3f3" stroke-width="1.3" stroke-linecap="round"/>
            <rect x="5.4" y="9.6" width="13.2" height="4.6" rx="1.2" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.6"/>
            <rect x="3.4" y="14.2" width="17.2" height="6.4" rx="1.4" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>
            <path d="M3.6 16.6 q1.4 1.4 2.8 0 t2.8 0 t2.8 0 t2.8 0 t2.8 0 t2.8 0" fill="none" stroke="currentColor" stroke-width="1.2"/>
            <circle class="sprinkle" cx="8.4" cy="12" r="0.6" fill="#ff8fab"/>
            <circle class="sprinkle sprinkle-2" cx="12.4" cy="11.6" r="0.6" fill="#ffd43b"/>
            <circle class="sprinkle sprinkle-3" cx="15.6" cy="12.2" r="0.6" fill="#f3f3f3"/>
        </g>
        <!--location: the pin bounces and a ripple spreads under it-->
        <g v-else-if="name === 'location'">
            <ellipse class="ripple" cx="12" cy="20.6" rx="5" ry="1.6" fill="none" stroke="currentColor" stroke-width="1"/>
            <ellipse class="shadow" cx="12" cy="20.6" rx="2.6" ry="0.8" fill="currentColor" fill-opacity="0.35"/>
            <g class="pin">
                <path d="M12 20 C8.4 15.6 6 12.6 6 9.4 a6 6 0 0 1 12 0 c0 3.2 -2.4 6.2 -6 10.6 z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <circle cx="12" cy="9.4" r="2.2" fill="currentColor"/>
            </g>
        </g>
    </svg>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.info-icon {
    width: 1.5em;
    height: 1.5em;
    overflow: visible;
}
.info-icon [class] {
    transform-box: fill-box;
    transform-origin: center;
    /* play once when the page loads, then rest */
    animation-iteration-count: 1;
}
/* and again while the row is hovered */
a:hover .info-icon [class] {
    animation-iteration-count: infinite;
}

/* email */
.flap {
    transform-origin: 50% 0;
    animation: flap 4s ease-in-out infinite;
}
.letter {
    animation: letter 4s ease-in-out infinite;
}
@keyframes flap {
    0%, 15%, 85%, 100% { transform: scaleY(1); }
    30%, 70% { transform: scaleY(-0.9); }
}
@keyframes letter {
    0%, 25%, 80%, 100% { transform: translateY(3px); }
    40%, 65% { transform: translateY(-2.4px); }
}

/* phone */
.ring {
    animation: ring 3.2s ease-in-out infinite;
}
.wave {
    opacity: 0;
    animation: wave 3.2s ease-out infinite;
}
.wave-2 {
    animation-delay: 0.15s;
}
@keyframes ring {
    0%, 40%, 100% { transform: rotate(0); }
    5%, 15%, 25% { transform: rotate(-12deg); }
    10%, 20%, 30% { transform: rotate(12deg); }
    35% { transform: rotate(0); }
}
@keyframes wave {
    0% { opacity: 0; transform: scale(0.8); }
    10%, 30% { opacity: 1; transform: scale(1); }
    45%, 100% { opacity: 0; transform: scale(1.15); }
}

/* birthday */
.flame {
    transform-origin: 50% 100%;
    animation: flame 0.5s ease-in-out infinite alternate;
}
.flame-2 {
    animation-delay: -0.2s;
}
.flame-3 {
    animation-delay: -0.35s;
}
.sprinkle {
    animation: sprinkle 1.6s ease-in-out infinite;
}
.sprinkle-2 {
    animation-delay: -0.5s;
}
.sprinkle-3 {
    animation-delay: -1s;
}
@keyframes flame {
    from { transform: scale(0.85, 0.8) skewX(-6deg); }
    to { transform: scale(1.05, 1.15) skewX(6deg); }
}
@keyframes sprinkle {
    0%, 100% { opacity: 0.4; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.3); }
}

/* location */
.pin {
    animation: pin 2.2s ease-in-out infinite;
}
.shadow {
    animation: pin-shadow 2.2s ease-in-out infinite;
}
.ripple {
    opacity: 0;
    animation: ripple 2.2s ease-out infinite;
}
@keyframes pin {
    0%, 50%, 100% { transform: translateY(0); }
    20% { transform: translateY(-3px); }
    35% { transform: translateY(0) scale(1.04, 0.96); }
}
@keyframes pin-shadow {
    0%, 50%, 100% { transform: scale(1); opacity: 1; }
    20% { transform: scale(0.6); opacity: 0.5; }
}
@keyframes ripple {
    0%, 30% { opacity: 0; transform: scale(0.4); }
    40% { opacity: 0.8; }
    100% { opacity: 0; transform: scale(1.3); }
}

@media (prefers-reduced-motion: reduce) {
    .info-icon [class] {
        animation: none !important;
    }
    .wave, .ripple {
        opacity: 0;
    }
}
</style>
