// Preview settings for testing the seasonal theme and the birthday balloons.
// The dev panel (npm run dev) changes them, and the url can set them too: ?theme=nowruz, ?date=2027-03-21, ?balloons=1
import { reactive } from 'vue';

const params = new URLSearchParams(window.location.search);

export const preview = reactive({
    theme: params.get('theme') || '',
    date: params.get('date') || '',
    balloons: params.get('balloons') === '1'
});

// today, or the date being previewed
export function previewDate() {
    return preview.date ? new Date(`${preview.date}T12:00:00`) : new Date();
}
