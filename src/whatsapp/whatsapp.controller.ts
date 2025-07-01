import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateWhatsappDto } from './dto/create-whatsapp.dto';
import { UpdateWhatsappDto } from './dto/update-whatsapp.dto';
import { WaapiService } from './whatsapp.service';

@Controller()
export class WhatsappController {
  constructor(private readonly whatsappService: WaapiService) {}

  @MessagePattern('createWhatsapp')
  create(@Payload() createWhatsappDto: CreateWhatsappDto) {

  }

  @MessagePattern('findAllWhatsapp')
  findAll() {

  }

  @MessagePattern('findOneWhatsapp')
  findOne(@Payload() id: number) {

  }

  @MessagePattern('updateWhatsapp')
  update(@Payload() updateWhatsappDto: UpdateWhatsappDto) {

  }

  @MessagePattern('removeWhatsapp')
  remove(@Payload() id: number) {

  }
}
