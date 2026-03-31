"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModule = void 0;
const common_1 = require("@nestjs/common");
const import_controller_1 = require("./import.controller");
const import_service_1 = require("./import.service");
const apple_podcasts_strategy_1 = require("./strategies/apple-podcasts.strategy");
const programs_module_1 = require("../programs/programs.module");
const episodes_module_1 = require("../episodes/episodes.module");
const media_module_1 = require("../media/media.module");
const categories_module_1 = require("../categories/categories.module");
const outbox_module_1 = require("../outbox/outbox.module");
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            programs_module_1.ProgramsModule,
            episodes_module_1.EpisodesModule,
            media_module_1.MediaModule,
            categories_module_1.CategoriesModule,
            outbox_module_1.OutboxModule,
        ],
        controllers: [import_controller_1.ImportController],
        providers: [apple_podcasts_strategy_1.ApplePodcastsStrategy, import_service_1.ImportService],
    })
], ImportModule);
//# sourceMappingURL=import.module.js.map