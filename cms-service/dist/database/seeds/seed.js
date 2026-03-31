"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../auth/entities/user.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
const program_entity_1 = require("../../programs/entities/program.entity");
const episode_entity_1 = require("../../episodes/entities/episode.entity");
const media_entity_1 = require("../../media/entities/media.entity");
const outbox_entity_1 = require("../../outbox/entities/outbox.entity");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
const dotenv = require("dotenv");
dotenv.config();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5433', 10),
    username: process.env.DB_USERNAME ?? 'cms_user',
    password: process.env.DB_PASSWORD ?? 'cms_password',
    database: process.env.DB_NAME ?? 'cms_db',
    entities: [user_entity_1.User, category_entity_1.Category, program_entity_1.Program, episode_entity_1.Episode, media_entity_1.Media, outbox_entity_1.Outbox],
    synchronize: true,
});
async function seed() {
    await dataSource.initialize();
    console.log('Database connected for seeding...');
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const categoryRepo = dataSource.getRepository(category_entity_1.Category);
    const existingAdmin = await userRepo.findOne({
        where: { email: 'admin@cms.com' },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await userRepo.save([
            {
                email: 'admin@cms.com',
                password: hashedPassword,
                name: 'Admin User',
                role: user_role_enum_1.UserRole.ADMIN,
            },
            {
                email: 'editor@cms.com',
                password: hashedPassword,
                name: 'Editor User',
                role: user_role_enum_1.UserRole.EDITOR,
            },
        ]);
        console.log('Users seeded:');
        console.log('  admin@cms.com / password123 (ADMIN)');
        console.log('  editor@cms.com / password123 (EDITOR)');
    }
    else {
        console.log('Users already exist, skipping...');
    }
    const existingCategories = await categoryRepo.count();
    if (existingCategories === 0) {
        await categoryRepo.save([
            { name: 'حوارات', slug: 'conversations' },
            { name: 'ثقافة', slug: 'culture' },
            { name: 'تقنية', slug: 'technology' },
            { name: 'أعمال', slug: 'business' },
            { name: 'ترفيه', slug: 'entertainment' },
            { name: 'وثائقي', slug: 'documentary' },
            { name: 'تعليم', slug: 'education' },
        ]);
        console.log('Categories seeded (7 categories)');
    }
    else {
        console.log('Categories already exist, skipping...');
    }
    await dataSource.destroy();
    console.log('Seeding complete!');
}
seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map