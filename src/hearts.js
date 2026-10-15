// The heart lock: a secret phrase unlocks a message meant only for the person who knows it.
// Only encrypted data is published. The phrases are never stored, each guess derives a key with a slow
// PBKDF2 and tries to decrypt the records with AES-GCM, a wrong phrase simply fails.
// Everything is packed into one opaque string, so the file shows no list of entries.
// The same code is used by the browser and by the local sealing tool (npm run seal).

export const ITERATIONS = 600000;
// every message is padded to the same size, so real records and decoys look exactly alike
export const PADDED_LENGTH = 768;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
// iv + padded message + 16 byte authentication tag
export const RECORD_LENGTH = IV_LENGTH + PADDED_LENGTH + 16;

// "Hello World " and "hello  world" are the same phrase
export function normalizePhrase(text) {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

const toBase64 = bytes => {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
};
const fromBase64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));

async function deriveKey(phrase, salt, iterations) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(normalizePhrase(phrase)), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// used by the local tool: one record (iv + encrypted padded message) for a phrase
export async function sealRecord(phrase, payload, salt, iterations = ITERATIONS) {
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    if (encoded.length > PADDED_LENGTH) throw new Error(`message for "${payload.name}" is too long`);
    const padded = new Uint8Array(PADDED_LENGTH).fill(0x20);
    padded.set(encoded);
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = await deriveKey(phrase, salt, iterations);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, padded));
    const record = new Uint8Array(RECORD_LENGTH);
    record.set(iv);
    record.set(ct, IV_LENGTH);
    return record;
}

// used by the local tool: salt, iteration count and all records in one base64 string
export function pack(salt, iterations, records) {
    const bytes = new Uint8Array(SALT_LENGTH + 4 + records.length * RECORD_LENGTH);
    bytes.set(salt);
    new DataView(bytes.buffer).setUint32(SALT_LENGTH, iterations);
    records.forEach((record, i) => bytes.set(record, SALT_LENGTH + 4 + i * RECORD_LENGTH));
    return toBase64(bytes);
}

function unpack(text) {
    const bytes = fromBase64(text);
    const salt = bytes.slice(0, SALT_LENGTH);
    const iterations = new DataView(bytes.buffer).getUint32(SALT_LENGTH);
    const records = [];
    for (let at = SALT_LENGTH + 4; at + RECORD_LENGTH <= bytes.length; at += RECORD_LENGTH) {
        records.push({ iv: bytes.slice(at, at + IV_LENGTH), ct: bytes.slice(at + IV_LENGTH, at + RECORD_LENGTH) });
    }
    return { salt, iterations, records };
}

// used by the site: returns the payload the phrase opens, or null
export async function unlock(phrase, vault) {
    const { salt, iterations, records } = unpack(vault);
    const key = await deriveKey(phrase, salt, iterations);
    for (const record of records) {
        try {
            const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: record.iv }, key, record.ct);
            return JSON.parse(new TextDecoder().decode(plain).trimEnd());
        } catch {
            // not this record
        }
    }
    return null;
}

// after 3 wrong phrases the lock rests 30 seconds, doubling each time up to an hour
const LOCK_KEY = 'heart-lock';

export function lockState() {
    try {
        return JSON.parse(localStorage.getItem(LOCK_KEY)) || { fails: 0, until: 0 };
    } catch {
        return { fails: 0, until: 0 };
    }
}

function saveLockState(state) {
    try {
        localStorage.setItem(LOCK_KEY, JSON.stringify(state));
    } catch {
        // storage blocked, the lock still works for this visit
    }
}

export function recordFailure() {
    const state = lockState();
    state.fails += 1;
    if (state.fails >= 3) state.until = Date.now() + Math.min(30000 * 2 ** (state.fails - 3), 3600000);
    saveLockState(state);
    return state;
}

export function recordSuccess() {
    saveLockState({ fails: 0, until: 0 });
}
