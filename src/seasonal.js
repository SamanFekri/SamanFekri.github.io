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
    const suriEvening = addDays(wednesday, -1);
    const stPatrick = utc(year, 3, 17);

    return [
        // st patrick's falls inside the suri and nowruz ranges, it shows on its own day unless that day is the suri evening itself
        ...(stPatrick.getTime() !== suriEvening.getTime() ? [{ id: 'stpatrick', start: stPatrick, end: stPatrick, day: stPatrick }] : []),
        { id: 'suri', start: addDays(wednesday, -4), end: wednesday, day: suriEvening },
        { id: 'nowruz', start: addDays(wednesday, 1), end: addDays(nowruz, 12), day: nowruz },
        { id: 'yalda', start: addDays(dey, -4), end: dey, day: addDays(dey, -1) },
        { id: 'halloween', start: utc(year, 10, 15), end: utc(year, 10, 31), day: utc(year, 10, 31) },
        { id: 'thanksgiving', start: addDays(thanksgiving, -6), end: addDays(thanksgiving, 1), day: thanksgiving },
        { id: 'christmas', start: utc(year, 12, 1), end: utc(year, 12, 30), day: utc(year, 12, 25) },
        { id: 'newyear', start: utc(year - 1, 12, 31), end: utc(year, 1, 2), day: utc(year, 1, 1), year },
        { id: 'newyear', start: utc(year, 12, 31), end: utc(year + 1, 1, 2), day: utc(year + 1, 1, 1), year: year + 1 },
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
