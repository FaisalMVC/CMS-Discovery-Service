"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSearchModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const opensearch_1 = require("@opensearch-project/opensearch");
const constants_1 = require("../common/constants");
const index_management_service_1 = require("./index-management.service");
const opensearch_config_1 = require("../config/opensearch.config");
let OpenSearchModule = class OpenSearchModule {
};
exports.OpenSearchModule = OpenSearchModule;
exports.OpenSearchModule = OpenSearchModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(opensearch_config_1.default)],
        providers: [
            {
                provide: constants_1.OPENSEARCH_CLIENT,
                useFactory: (configService) => {
                    return new opensearch_1.Client({
                        node: configService.get('opensearch.node'),
                    });
                },
                inject: [config_1.ConfigService],
            },
            index_management_service_1.IndexManagementService,
        ],
        exports: [constants_1.OPENSEARCH_CLIENT, index_management_service_1.IndexManagementService],
    })
], OpenSearchModule);
//# sourceMappingURL=opensearch.module.js.map