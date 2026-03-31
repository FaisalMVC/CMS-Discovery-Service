import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { ProgramType } from '../../common/enums/program-type.enum';
import { ContentStatus } from '../../common/enums/content-status.enum';
import { Category } from '../../categories/entities/category.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('programs')
@Unique(['source', 'sourceId'])
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProgramType })
  type: ProgramType;

  @Column({ default: 'ar' })
  language: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ default: 'manual' })
  source: string;

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.programs, {
    cascade: true,
  })
  @JoinTable({
    name: 'program_categories',
    joinColumn: { name: 'program_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => Episode, (episode) => episode.program, { cascade: true })
  episodes: Episode[];
}
