import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { ConfigService } from './services/config/config.service';
import { HttpService } from './common/services/http/http.service';
import { NatsModule } from './nats/nats.module';


@Module({
  imports: [JobsModule, NatsModule],
  providers: [HttpService, ConfigService],

})
export class AppModule {}
