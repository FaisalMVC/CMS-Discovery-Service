"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const opensearch_module_1 = require("./opensearch/opensearch.module");
const cache_module_1 = require("./cache/cache.module");
const messaging_module_1 = require("./messaging/messaging.module");
const programs_module_1 = require("./programs/programs.module");
const episodes_module_1 = require("./episodes/episodes.module");
const search_module_1 = require("./search/search.module");
const categories_module_1 = require("./categories/categories.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            opensearch_module_1.OpenSearchModule,
            cache_module_1.CacheModule,
            messaging_module_1.MessagingModule,
            programs_module_1.ProgramsModule,
            episodes_module_1.EpisodesModule,
            search_module_1.SearchModule,
            categories_module_1.CategoriesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map