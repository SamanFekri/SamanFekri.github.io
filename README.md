# Saman Fekri · Personal Homepage

The source of **[samanfekri.me](https://samanfekri.me)**, my personal homepage and online CV, built with Vue 3, Vite and Tailwind CSS.

## Features

- **Animated profile:** a looping Memoji avatar that flips to a photo when clicked.
- **Live mood:** my current mood, shown as an animated sticker from my Telegram bot [@MoodPalBot](https://t.me/MoodPalBot).
- **Live weather and time in Milan:** an animated badge with its own scene for every weather code (sun, moon, rain, snow, fog, hail, storms…), using data from [Open-Meteo](https://open-meteo.com).
- **Sliding sections:** About, Experience, Education and More, each with its own small animated tab icon.
- **Waving flags** next to the languages I speak.
- **Easy to update:** all text lives in JSON files, so updating the CV doesn't need any code changes.
- **Accessible:** every animation turns off for visitors who set "reduce motion" in their system settings.

## Editing the content

All content is in [`public/data`](public/data):

| File | What it holds |
| --- | --- |
| `personal.json` | name, bio, photos, contact details, location, social links, CV button |
| `about.json` | summary, skills and languages |
| `experience.json` | work experience |
| `education.json` | degrees |
| `more.json` | personal projects, interests and hobbies |

The weather badge reads the city from the `Location` entry in `personal.json`, so changing it there moves the weather too.

## Running it locally

Requires Node 20+ and Yarn.

```sh
yarn install   # install dependencies
yarn dev       # start the dev server with hot reload
yarn build     # build the production site into dist/
yarn preview   # serve the built site locally
```

## Deployment

The repository has two branches:

- **`code`:** the source code. Work here.
- **`master`:** the built site that GitHub Pages serves. Don't edit it by hand.

Every push to `code` runs the [deploy workflow](.github/workflows/deploy.yml). It builds the site and publishes `dist/` to `master` with the `samanfekri.me` domain. You can also start it by hand from the **Actions** tab.

## Project structure

```
public/
  data/          content of the site (JSON)
  flags/         language flags (SVG)
src/
  components/    Vue components (sections, sidebar, tab icons, weather badge…)
  data.js        loads and caches the JSON data
  main.js        app entry
.github/workflows/deploy.yml   build and deploy to master
```

## Credits

- Weather data by [Open-Meteo.com](https://open-meteo.com) (CC BY 4.0)
- Mood stickers by [Mood Pal](https://t.me/MoodPalBot)
- Icons by [Font Awesome](https://fontawesome.com)
