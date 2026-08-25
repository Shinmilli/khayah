"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPin = hashPin;
exports.verifyPin = verifyPin;
const crypto_1 = require("crypto");
function scrypt(password, salt, keylen) {
    return new Promise((resolve, reject) => {
        (0, crypto_1.scrypt)(password, salt, keylen, (err, derivedKey) => {
            if (err)
                reject(err);
            else
                resolve(derivedKey);
        });
    });
}
/** scrypt 해시 저장 형식: scrypt$saltHex$hashHex */
async function hashPin(pin) {
    const salt = (0, crypto_1.randomBytes)(16);
    const key = await scrypt(pin, salt, 32);
    return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}
async function verifyPin(pin, stored) {
    const parts = stored.split('$');
    if (parts.length !== 3 || parts[0] !== 'scrypt')
        return false;
    const salt = Buffer.from(parts[1], 'hex');
    const expected = Buffer.from(parts[2], 'hex');
    if (salt.length === 0 || expected.length === 0)
        return false;
    const key = await scrypt(pin, salt, expected.length);
    if (key.length !== expected.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(key, expected);
}
//# sourceMappingURL=pinHash.js.map