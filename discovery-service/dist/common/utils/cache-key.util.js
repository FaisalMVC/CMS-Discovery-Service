"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCacheKey = buildCacheKey;
const crypto_1 = require("crypto");
function buildCacheKey(prefix, params) {
    const sorted = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
        if (params[key] !== undefined && params[key] !== null) {
            acc[key] = params[key];
        }
        return acc;
    }, {});
    const hash = (0, crypto_1.createHash)('md5')
        .update(JSON.stringify(sorted))
        .digest('hex')
        .substring(0, 12);
    return `${prefix}:${hash}`;
}
//# sourceMappingURL=cache-key.util.js.map