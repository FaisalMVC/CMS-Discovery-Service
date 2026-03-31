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
const typeorm_1 = require("@nestjs/typeorm");
const configuration_1 = require("./common/config/configuration");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const programs_module_1 = require("./programs/programs.module");
const episodes_module_1 = require("./episodes/episodes.module");
const media_module_1 = require("./media/media.module");
const outbox_module_1 = require("./outbox/outbox.module");
const import_module_1 = require("./import/import.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.name'),
                    autoLoadEntities: true,
                    synchronize: configService.get('nodeEnv') === 'development',
                    logging: configService.get('nodeEnv') === 'development',
                }),
            }),
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            programs_module_1.ProgramsModule,
            episodes_module_1.EpisodesModule,
            media_module_1.MediaModule,
            outbox_module_1.OutboxModule,
            import_module_1.ImportModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map