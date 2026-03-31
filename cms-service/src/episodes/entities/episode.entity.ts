import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ContentStatus } from '../../common/enums/content-status.enum';
import { Program } from '../../programs/entities/program.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('episodes')
@Unique(['source', 'sourceId'])
export class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'episode_number', nullable: true })
  episodeNumber: number;

  @Column({ name: 'season_number', nullable: true })
  seasonNumber: number;

  @Column({ name: 'duration_seconds', default: 0 })
  durationSeconds: number;

  @Column({ name: 'publish_date', type: 'date', nullable: true })
  publishDate: Date;

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

  @Column({ name: 'program_id' })
  programId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Program, (program) => program.episodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @OneToMany(() => Media, (media) => media.episode, { cascade: true })
  media: Media[];
}
