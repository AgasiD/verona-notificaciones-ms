import { Module } from '@nestjs/common';

import { PushController } from './push.controller';
import { PushNotificactionService } from './push.service';

@Module({
  controllers: [PushController],
  providers: [PushNotificactionService],
})
export class PushModule { }
