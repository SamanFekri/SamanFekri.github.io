// Picks the theme for a date: persian events first, then american events, then the persian season.
// Persian dates come from the browser's persian calendar so they are right for every year.

const DAY = 24 * 60 * 60 * 1000;

const utc = (year, month, day) => new Date(Date.UTC(year, month - 1, day));
const addDays = (date, days) => new Date(date.getTime() + days * DAY);

const persianFormat = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC'
});

// gregorian date -> { year, month, day } in the persian calendar
export function toPersian(date) {
    const parts = persianFormat.formatToParts(date);
    const get = type => Number(parts.find(p => p.type === type).value);
    return { year: get('year'), month: get('month'), day: get('day') };
}

// finds the gregorian day of a persian month/day by looking around where it usually falls
function findPersianDay(year, month, fromDay, toDay, persianMonth, persianDay) {
    for (let day = fromDay; day <= toDay; day++) {
        const date = utc(year, month, day);
        const p = toPersian(date);
        if (p.month === persianMonth && p.day === persianDay) return date;
    }
    throw new Error(`persian ${persianMonth}/${persianDay} not found in ${year}`);
}

// 1 Farvardin, persian new year
const nowruzDay = year => findPersianDay(year, 3, 18, 24, 1, 1);
// 1 Dey, the night before it is yalda
const firstOfDey = year => findPersianDay(year, 12, 18, 25, 10, 1);

// western (catholic) easter sunday, it moves every year (anonymous gregorian algorithm)
function easterDay(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return utc(year, month, day);
}

// the nth weekday of a month, weekday 0 is sunday
function nthWeekday(year, month, weekday, n) {
    const first = utc(year, month, 1);
    const offset = (weekday - first.getUTCDay() + 7) % 7;
    return utc(year, month, 1 + offset + (n - 1) * 7);
}

// all the event ranges of a gregorian year, in priority order
export function eventsOf(year) {
    const nowruz = nowruzDay(year);
    // chaharshanbe suri is the evening before the last wednesday of the year
    let wednesday = addDays(nowruz, -1);
    while (wednesday.getUTCDay() !== 3) wednesday = addDays(wednesday, -1);
    const dey = firstOfDey(year);
    const thanksgiving = nthWeekday(year, 11, 4, 4);
    const easter = easterDay(year);
    const suriEvening = addDays(wednesday, -1);
    const stPatrick = utc(year, 3, 17);

    return [
        // sizdah bedar, 13 farvardin, is the first priority and only one day
        { id: 'sizdah', start: addDays(nowruz, 12), end: addDays(nowruz, 12), day: addDays(nowruz, 12) },
        // st patrick's falls inside the suri and nowruz ranges, it shows on its own day unless that day is the suri evening itself
        ...(stPatrick.getTime() !== suriEvening.getTime() ? [{ id: 'stpatrick', start: stPatrick, end: stPatrick, day: stPatrick }] : []),
        { id: 'suri', start: addDays(wednesday, -4), end: wednesday, day: suriEvening },
        { id: 'nowruz', start: addDays(wednesday, 1), end: addDays(nowruz, 11), day: nowruz },
        { id: 'yalda', start: addDays(dey, -4), end: dey, day: addDays(dey, -1) },
        // after the persian events, so when easter falls inside nowruz, nowruz wins
        { id: 'easter', start: addDays(easter, -2), end: addDays(easter, 1), day: easter },
        { id: 'halloween', start: utc(year, 10, 15), end: utc(year, 10, 31), day: utc(year, 10, 31) },
        { id: 'thanksgiving', start: addDays(thanksgiving, -6), end: addDays(thanksgiving, 1), day: thanksgiving },
        { id: 'christmas', start: utc(year, 12, 1), end: utc(year, 12, 30), day: utc(year, 12, 25) },
        { id: 'newyear', start: utc(year - 1, 12, 31), end: utc(year, 1, 5), day: utc(year, 1, 1), year },
        { id: 'epifania', start: utc(year, 1, 6), end: utc(year, 1, 6), day: utc(year, 1, 6) },
        { id: 'newyear', start: utc(year, 12, 31), end: utc(year + 1, 1, 5), day: utc(year + 1, 1, 1), year: year + 1 },
        { id: 'valentine', start: utc(year, 2, 10), end: utc(year, 2, 14), day: utc(year, 2, 14) }
    ];
}

// the persian season of a date
export function seasonOf(date) {
    const month = toPersian(date).month;
    if (month <= 3) return 'spring';
    if (month <= 6) return 'summer';
    if (month <= 9) return 'autumn';
    return 'winter';
}

// the theme for a local date, like { id: 'nowruz', day, year } or { id: 'autumn' }
export function themeFor(localDate = new Date()) {
    const date = utc(localDate.getFullYear(), localDate.getMonth() + 1, localDate.getDate());
    const event = eventsOf(date.getUTCFullYear()).find(e => date >= e.start && date <= e.end);
    return event || { id: seasonOf(date) };
}

// my birthday: 15 june and 25 khordad, in some years they are one day apart and both count
export function isBirthday(localDate = new Date()) {
    const date = utc(localDate.getFullYear(), localDate.getMonth() + 1, localDate.getDate());
    if (date.getUTCMonth() === 5 && date.getUTCDate() === 15) return true;
    const p = toPersian(date);
    return p.month === 3 && p.day === 25;
}
