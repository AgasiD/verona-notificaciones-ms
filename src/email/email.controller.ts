import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

    @EventPattern('noticacaciones.enviarEmail')
    async enviarEmail(@Payload() payload: any){
      return await this.emailService.sendEmail(payload);
  }
}
