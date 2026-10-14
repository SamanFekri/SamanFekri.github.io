<template>
    <!--small hand drawn icons for the section tabs, outlines use currentColor so they follow the tab color-->
    <svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <!--about: a little me with fedora and sunglasses, tipping the hat to say hi-->
        <g v-if="name === 'me'">
            <circle cx="12" cy="14.6" r="6.4" fill="none" stroke="currentColor" stroke-width="1.7"/>
            <rect x="7.5" y="12.6" width="3.9" height="2.7" rx="1.1" fill="currentColor"/>
            <rect x="12.6" y="12.6" width="3.9" height="2.7" rx="1.1" fill="currentColor"/>
            <path d="M11.3 13.5 h1.4" stroke="currentColor" stroke-width="1"/>
            <path class="glint" d="M8.4 14.8 l1.3 -1.6" stroke="#ffffff" stroke-width="0.7" stroke-linecap="round"/>
            <path d="M10.2 18 q1.8 1.3 3.6 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <g class="hat">
                <path d="M7.4 9.4 C7.4 5.6 8.9 3.4 12 3.4 C15.1 3.4 16.6 5.6 16.6 9.4 Z" fill="currentColor"/>
                <path d="M7.6 7.7 h8.8" stroke="#f3f3f3" stroke-width="1.3"/>
                <path d="M4.2 9.8 q7.8 -2.2 15.6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </g>
        </g>
        <!--experience: a laptop typing code-->
        <g v-else-if="name === 'laptop'">
            <rect x="4" y="4.5" width="16" height="11.5" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="M2 19.2 h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M10.4 19.2 h3.2" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
            <path class="type type-1" d="M6.8 8 h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" pathLength="1"/>
            <path class="type type-2" d="M8.4 10.6 h8" stroke="#6ee7b7" stroke-width="1.5" stroke-linecap="round" pathLength="1"/>
            <path class="type type-3" d="M6.8 13.2 h4.4" stroke="#7cc4ff" stroke-width="1.5" stroke-linecap="round" pathLength="1"/>
        </g>
        <!--education: a graduation cap with a swinging tassel-->
        <g v-else-if="name === 'cap'">
            <path d="M6.2 10.6 v4.4 c0 1.6 2.6 2.9 5.8 2.9 s5.8 -1.3 5.8 -2.9 v-4.4" fill="currentColor" opacity="0.75"/>
            <polygon points="12,3.6 22.4,8.8 12,14 1.6,8.8" fill="currentColor"/>
            <path d="M12 8.8 L19.6 10.4" stroke="#ffd166" stroke-width="1.2" stroke-linecap="round"/>
            <g class="tassel">
                <path d="M19.6 10.4 v5.2" stroke="#ffd166" stroke-width="1.2" stroke-linecap="round"/>
                <path d="M18.6 15.4 h2 l0.4 2.6 h-2.8 z" fill="#ffd166"/>
            </g>
            <path class="sparkle" d="M4 1.4 l0.7 1.6 l1.6 0.7 l-1.6 0.7 l-0.7 1.6 l-0.7 -1.6 l-1.6 -0.7 l1.6 -0.7 z" fill="#ffd166"/>
        </g>
        <!--more: a magnifier searching around, it finds a little sparkle-->
        <g v-else-if="name === 'magnifier'">
            <path class="found" d="M18.6 3 l0.7 1.6 l1.6 0.7 l-1.6 0.7 l-0.7 1.6 l-0.7 -1.6 l-1.6 -0.7 l1.6 -0.7 z" fill="#ffd166"/>
            <g class="search">
                <circle cx="10" cy="10" r="5.6" fill="#7cc4ff" fill-opacity="0.18" stroke="currentColor" stroke-width="1.9"/>
                <path class="shine" d="M7.2 9 a3 3 0 0 1 2.4 -2.2" fill="none" stroke="#ffffff" stroke-width="1.1" stroke-linecap="round"/>
                <path d="M14.2 14.2 l5.4 5.4" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
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
.tab-icon {
    display: inline-block;
    width: 1.6em;
    height: 1.6em;
    vertical-align: -0.42em;
    overflow: visible;
}
.tab-icon * {
    transform-box: fill-box;
}

/* me */
.hat {
    transform-origin: 0% 100%;
    animation: hat 3.2s ease-in-out infinite;
}
.glint {
    animation: glint 3.2s ease-in-out infinite;
}
@keyframes hat {
    0%, 55%, 100% { transform: translateY(0) rotate(0); }
    65% { transform: translateY(-2.6px) rotate(-14deg); }
    75% { transform: translateY(-2.6px) rotate(-10deg); }
    85% { transform: translateY(0) rotate(0); }
}
@keyframes glint {
    0%, 20% { transform: translateX(0); opacity: 0; }
    25% { opacity: 1; }
    40% { transform: translateX(7.6px); opacity: 0; }
    100% { transform: translateX(7.6px); opacity: 0; }
}

/* laptop, each line is drawn one after another like typing */
.type {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: type 3s steps(6) infinite;
}
.type-2 {
    animation-name: type-2;
}
.type-3 {
    animation-name: type-3;
}
@keyframes type {
    0% { stroke-dashoffset: 1; }
    25%, 90% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 1; }
}
@keyframes type-2 {
    0%, 25% { stroke-dashoffset: 1; }
    50%, 90% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 1; }
}
@keyframes type-3 {
    0%, 50% { stroke-dashoffset: 1; }
    70%, 90% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 1; }
}

/* cap */
.tassel {
    transform-origin: 50% 0;
    animation: tassel 2.2s ease-in-out infinite;
}
.sparkle {
    transform-origin: center;
    animation: sparkle 1.8s ease-in-out infinite;
}
@keyframes tassel {
    0%, 100% { transform: rotate(14deg); }
    50% { transform: rotate(-14deg); }
}
@keyframes sparkle {
    0%, 100% { transform: scale(0.3) rotate(0); opacity: 0.3; }
    50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
}

/* magnifier */
.search {
    animation: search 3.2s ease-in-out infinite;
}
.shine {
    transform-origin: 50% 50%;
    animation: shine 3.2s ease-in-out infinite;
}
.found {
    transform-origin: center;
    opacity: 0;
    animation: found 3.2s ease-out infinite;
}
@keyframes search {
    0%, 100% { transform: translate(0, 0) rotate(0); }
    20% { transform: translate(2px, -1.5px) rotate(8deg); }
    40% { transform: translate(-1.5px, -2px) rotate(-6deg); }
    60% { transform: translate(1.6px, -2.4px) rotate(4deg); }
    80% { transform: translate(1.6px, -2.4px) rotate(4deg); }
}
@keyframes shine {
    0%, 100% { opacity: 0.5; transform: rotate(0); }
    50% { opacity: 1; transform: rotate(-25deg); }
}
@keyframes found {
    0%, 58% { transform: scale(0.2) rotate(0); opacity: 0; }
    68% { transform: scale(1.2) rotate(45deg); opacity: 1; }
    82% { transform: scale(0.9) rotate(80deg); opacity: 1; }
    92%, 100% { transform: scale(0.2) rotate(90deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .tab-icon * {
        animation: none !important;
    }
    .type {
        stroke-dashoffset: 0;
    }
}
</style>
