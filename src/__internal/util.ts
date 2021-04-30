export function debuglog(...params) {
    if (APP_STORE_BEDBUG) {
        console.log(...params);
    }
}