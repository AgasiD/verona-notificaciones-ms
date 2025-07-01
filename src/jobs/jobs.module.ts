import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { NatsModule } from 'src/nats/nats.module';
import { ConfigService } from 'src/services/config/config.service';
import { HttpService } from 'src/common/services/http/http.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, ConfigService, HttpService],
  imports: [NatsModule]

})
export class JobsModule {}
