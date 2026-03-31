import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { ApplePodcastsStrategy } from './strategies/apple-podcasts.strategy';
import { ProgramsModule } from '../programs/programs.module';
import { EpisodesModule } from '../episodes/episodes.module';
import { MediaModule } from '../media/media.module';
import { CategoriesModule } from '../categories/categories.module';
import { OutboxModule } from '../outbox/outbox.module';

@Module({
  imports: [
    ProgramsModule,
    EpisodesModule,
    MediaModule,
    CategoriesModule,
    OutboxModule,
  ],
  controllers: [ImportController],
  providers: [ApplePodcastsStrategy, ImportService],
})
export class ImportModule {}