import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Program } from '../../programs/entities/program.entity';
import { Episode } from '../../episodes/entities/episode.entity';
import { Media } from '../../media/entities/media.entity';
import { Outbox } from '../../outbox/entities/outbox.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5433', 10),
  username: process.env.DB_USERNAME ?? 'cms_user',
  password: process.env.DB_PASSWORD ?? 'cms_password',
  database: process.env.DB_NAME ?? 'cms_db',
  entities: [User, Category, Program, Episode, Media, Outbox],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected for seeding...');

  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
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
        role: UserRole.ADMIN,
      },
      {
        email: 'editor@cms.com',
        password: hashedPassword,
        name: 'Editor User',
        role: UserRole.EDITOR,
      },
    ]);

    console.log('Users seeded:');
    console.log('  admin@cms.com / password123 (ADMIN)');
    console.log('  editor@cms.com / password123 (EDITOR)');
  } else {
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
  } else {
    console.log('Categories already exist, skipping...');
  }

  await dataSource.destroy();
  console.log('Seeding complete!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
