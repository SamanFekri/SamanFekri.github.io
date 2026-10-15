// Local tool for the heart lock, run on this computer only.
//   npm run seal                    encrypt the enabled messages into public/data/hearts.json
//   npm run hearts list             show every message and whether it is on or off
//   npm run hearts enable <name>    turn a message on  (or: enable all)
//   npm run hearts disable <name>   turn a message off (or: disable all)
//   or just change "enabled" in hearts.private.json: npm run dev and npm run build seal it again by themselves
// hearts.private.json is git ignored and stays here, only the encrypted file is published.
// It is a list of { "phrase", "name", "enabled", "mood": "sparkle" | "always", "text" }.
// The output is a single opaque string: no list of entries, no names, no phrases.
// Disabled messages are replaced by decoys, so the file looks the same whatever is on or off.
//   flags used by the dev server and the build: --if-present (skip when there is no private file, like on github)
//   and --if-changed (skip when the private file did not change since the last seal)
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { sealRecord, pack, normalizePhrase, ITERATIONS, RECORD_LENGTH } from '../src/hearts.js';

const SOURCE = 'hearts.private.json';
const TARGET = 'public/data/hearts.json';
// a hash of the private file at the last seal, git ignored, so unchanged messages are not sealed again
const SEALED_MARK = '.hearts-sealed';
const TOTAL_RECORDS = 12;

const flags = process.argv.slice(2).filter(arg => arg.startsWith('--'));
if (!fs.existsSync(SOURCE)) {
    if (flags.includes('--if-present')) process.exit(0);
    console.error(`${SOURCE} not found`);
    process.exit(1);
}
const sourceText = fs.readFileSync(SOURCE, 'utf8');
const sourceHash = createHash('sha256').update(sourceText).digest('hex');
if (flags.includes('--if-changed') && fs.existsSync(TARGET) && fs.existsSync(SEALED_MARK) && fs.readFileSync(SEALED_MARK, 'utf8') === sourceHash) process.exit(0);

const source = JSON.parse(sourceText);
const [command, ...rest] = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const target = rest.join(' ').toLowerCase();

function markSealed() {
    fs.writeFileSync(SEALED_MARK, createHash('sha256').update(fs.readFileSync(SOURCE, 'utf8')).digest('hex'));
}

function list() {
    for (const item of source) console.log(`${item.enabled === false ? 'off' : 'on '}  ${item.name.padEnd(10)} "${item.phrase}"`);
}

if (command === 'list') {
    list();
    process.exit(0);
}

if (command === 'enable' || command === 'disable') {
    const matches = target === 'all' ? source : source.filter(item => item.name.toLowerCase() === target);
    if (!target || matches.length === 0) {
        console.error(`no message for "${rest.join(' ')}", names are: ${source.map(item => item.name).join(', ')}`);
        process.exit(1);
    }
    matches.forEach(item => { item.enabled = command === 'enable'; });
    fs.writeFileSync(SOURCE, JSON.stringify(source, null, 4) + '\n');
} else if (command) {
    console.error('commands: list, enable <name|all>, disable <name|all>, or nothing to just seal');
    process.exit(1);
}

const enabled = source.filter(item => item.enabled !== false);
const phrases = enabled.map(item => normalizePhrase(item.phrase));
if (new Set(phrases).size !== phrases.length) throw new Error('two enabled messages have the same phrase');

if (enabled.length === 0) {
    // nothing to unlock, the site hides the heart button
    fs.writeFileSync(TARGET, 'null\n');
    markSealed();
    console.log(`all messages are off, ${TARGET} is empty and the heart button is hidden`);
    process.exit(0);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const records = [];
for (const item of enabled) {
    records.push(await sealRecord(item.phrase, { name: item.name, text: item.text, mood: item.mood || 'sparkle' }, salt));
}
// a decoy is random bytes of the same size as a real record, it opens with nothing
while (records.length < Math.max(TOTAL_RECORDS, enabled.length + 3)) {
    records.push(crypto.getRandomValues(new Uint8Array(RECORD_LENGTH)));
}
// shuffle so the real records are not at the start
for (let i = records.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [records[i], records[j]] = [records[j], records[i]];
}

fs.writeFileSync(TARGET, JSON.stringify(pack(salt, ITERATIONS, records)) + '\n');
markSealed();
list();
console.log(`sealed ${enabled.length} of ${source.length} messages into ${TARGET}`);
