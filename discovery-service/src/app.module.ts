import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenSearchModule } from './opensearch/opensearch.module';
import { CacheModule } from './cache/cache.module';
import { MessagingModule } from './messaging/messaging.module';
import { ProgramsModule } from './programs/programs.module';
import { EpisodesModule } from './episodes/episodes.module';
import { SearchModule } from './search/search.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OpenSearchModule,
    CacheModule,
    MessagingModule,
    ProgramsModule,
    EpisodesModule,
    SearchModule,
    CategoriesModule,
  ],
})
export class AppModule {}
