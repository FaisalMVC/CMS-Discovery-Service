import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MinioService } from './minio.service';
import { OutboxModule } from '@outbox/outbox.module';
import { EpisodesModule } from '@episodes/episodes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    EpisodesModule,   
    OutboxModule,     
  ],
  providers: [MinioService, MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}