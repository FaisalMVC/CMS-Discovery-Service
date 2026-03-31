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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const slugify_1 = require("slugify");
const category_entity_1 = require("./entities/category.entity");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(dto) {
        const slug = dto.slug || (0, slugify_1.default)(dto.name, { lower: true, strict: true });
        const existing = await this.categoryRepository.findOne({
            where: [{ name: dto.name }, { slug }],
        });
        if (existing) {
            throw new common_1.ConflictException('Category with this name or slug already exists');
        }
        const category = this.categoryRepository.create({
            name: dto.name,
            slug,
        });
        return this.categoryRepository.save(category);
    }
    async findAll(query) {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const [data, total] = await this.categoryRepository.findAndCount({
            order: { name: 'ASC' },
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
        const category = await this.categoryRepository.findOne({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }
    async update(id, dto) {
        const category = await this.findOne(id);
        if (dto.name) {
            category.name = dto.name;
            category.slug = dto.slug || (0, slugify_1.default)(dto.name, { lower: true, strict: true });
        }
        if (dto.slug) {
            category.slug = dto.slug;
        }
        return this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
    async findByIds(ids) {
        return this.categoryRepository.findByIds(ids);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map