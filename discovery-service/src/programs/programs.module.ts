import { Module, forwardRef } from '@nestjs/common';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ProgramsRepository } from './programs.repository';
import { EpisodesModule } from '../episodes/episodes.module';

@Module({
  imports: [forwardRef(() => EpisodesModule)],
  controllers: [ProgramsController],
  providers: [ProgramsService, ProgramsRepository],
  exports: [ProgramsService, ProgramsRepository],
})
export class ProgramsModule {}
