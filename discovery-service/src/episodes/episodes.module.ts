import { Module, forwardRef } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { EpisodesRepository } from './episodes.repository';
import { ProgramsModule } from '../programs/programs.module';

@Module({
  imports: [forwardRef(() => ProgramsModule)],
  controllers: [EpisodesController],
  providers: [EpisodesService, EpisodesRepository],
  exports: [EpisodesService, EpisodesRepository],
})
export class EpisodesModule {}
