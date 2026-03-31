"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const program_entity_1 = require("./entities/program.entity");
const categories_service_1 = require("../categories/categories.service");
const outbox_service_1 = require("../outbox/outbox.service");
const event_type_enum_1 = require("../common/enums/event-type.enum");
let ProgramsService = class ProgramsService {
    constructor(programRepository, categoriesService, outboxService, dataSource) {
        this.programRepository = programRepository;
        this.categoriesService = categoriesService;
        this.outboxService = outboxService;
        this.dataSource = dataSource;
    }
    async create(dto) {
        return this.dataSource.transaction(async (manager) => {
            const program = manager.create(program_entity_1.Program, {
                title: dto.title,
                description: dto.description,
                type: dto.type,
                language: dto.language || 'ar',
                thumbnailUrl: dto.thumbnailUrl,
                status: dto.status,
            });
            if (dto.categoryIds?.length) {
                program.categories = await this.categoriesService.findByIds(dto.categoryIds);
            }
            const savedProgram = await manager.save(program_entity_1.Program, program);
            await this.outboxService.createEntry(manager, 'program', savedProgram.id, event_type_enum_1.EventType.CREATED, this.buildPayload(savedProgram));
            return savedProgram;
        });
    }
    async findAll(query) {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const [data, total] = await this.programRepository.findAndCount({
            relations: ['categories'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const program = await this.programRepository.findOne({
            where: { id },
            relations: ['categories', 'episodes'],
        });
        if (!program) {
            throw new common_1.NotFoundException(`Program with ID "${id}" not found`);
        }
        return program;
    }
    async update(id, dto) {
        return this.dataSource.transaction(async (manager) => {
            const program = await manager.findOne(program_entity_1.Program, {
                where: { id },
                relations: ['categories'],
            });
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID "${id}" not found`);
            }
            if (dto.title !== undefined)
                program.title = dto.title;
            if (dto.description !== undefined)
                program.description = dto.description;
            if (dto.type !== undefined)
                program.type = dto.type;
            if (dto.language !== undefined)
                program.language = dto.language;
            if (dto.thumbnailUrl !== undefined)
                program.thumbnailUrl = dto.thumbnailUrl;
            if (dto.status !== undefined)
                program.status = dto.status;
            if (dto.categoryIds) {
                program.categories = await this.categoriesService.findByIds(dto.categoryIds);
            }
            const updatedProgram = await manager.save(program_entity_1.Program, program);
            await this.outboxService.createEntry(manager, 'program', updatedProgram.id, event_type_enum_1.EventType.UPDATED, this.buildPayload(updatedProgram));
            return updatedProgram;
        });
    }
    async remove(id) {
        return this.dataSource.transaction(async (manager) => {
            const program = await manager.findOne(program_entity_1.Program, {
                where: { id },
            });
            if (!program) {
                throw new common_1.NotFoundException(`Program with ID "${id}" not found`);
            }
            await this.outboxService.createEntry(manager, 'program', program.id, event_type_enum_1.EventType.DELETED, { id: program.id });
            await manager.remove(program_entity_1.Program, program);
        });
    }
    async findBySourceId(source, sourceId) {
        return this.programRepository.findOne({
            where: { source, sourceId },
            relations: ['categories'],
        });
    }
    buildPayload(program) {
        return {
            id: program.id,
            title: program.title,
            description: program.description,
            type: program.type,
            language: program.language,
            thumbnailUrl: program.thumbnailUrl,
            status: program.status,
            source: program.source,
            sourceId: program.sourceId,
            categories: program.categories?.map((c) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
            })) || [],
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
        };
    }
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(program_entity_1.Program)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService,
        outbox_service_1.OutboxService,
        typeorm_2.DataSource])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map