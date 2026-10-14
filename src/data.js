import axios from 'axios'

// cache of the json requests, so switching sections does not fetch the same file again
const cache = {}

export function loadData(name) {
    if (!cache[name]) {
        cache[name] = axios.get(`./data/${name}.json`)
            .then(response => response.data)
            .catch(error => {
                // forget the failed request so the next visit tries again
                delete cache[name];
                throw error;
            });
    }
    return cache[name];
}
