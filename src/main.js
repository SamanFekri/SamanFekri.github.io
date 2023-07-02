import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

// added for tailwindcss
import 'tailwindcss/tailwind.css'

// added for fontawesome
// import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
// import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faEnvelope, faBirthdayCake, faMapMarkerAlt, faMobileAlt, faMobileButton, faMobileScreenButton, faArrowDown, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEnvelope, faBirthdayCake, faMapMarkerAlt, faMobileAlt, faMobileButton, faMobileScreenButton,  faTwitter, faGithub, faInstagram, faLinkedin, faArrowDown, faCalendar)

const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
