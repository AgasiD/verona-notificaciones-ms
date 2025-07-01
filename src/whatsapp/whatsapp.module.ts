import { Module } from '@nestjs/common';

import { WhatsappController } from './whatsapp.controller';

@Module({
  controllers: [WhatsappController],
  // providers: [WhatsappService],
})
export class WhatsappModule {}
