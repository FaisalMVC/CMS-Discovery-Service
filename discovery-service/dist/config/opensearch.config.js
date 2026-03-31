"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('opensearch', () => ({
    node: process.env.OPENSEARCH_NODE || 'http://localhost:9200',
}));
//# sourceMappingURL=opensearch.config.js.map