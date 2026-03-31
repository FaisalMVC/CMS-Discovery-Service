import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT } from '../common/constants';
import { IndexManagementService } from './index-management.service';
import opensearchConfig from '../config/opensearch.config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(opensearchConfig)],
  providers: [
    {
      provide: OPENSEARCH_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Client({
          node: configService.get<string>('opensearch.node'),
        });
      },
      inject: [ConfigService],
    },
    IndexManagementService,
  ],
  exports: [OPENSEARCH_CLIENT, IndexManagementService],
})
export class OpenSearchModule {}
