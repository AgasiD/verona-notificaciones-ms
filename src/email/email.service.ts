import { Injectable } from '@nestjs/common';
import { EmailSender } from './entities/Email.entity';
import { envs } from 'src/config/envs';

@Injectable()
export class EmailService {
    emailSender: EmailSender

    constructor() {
        this.emailSender = new EmailSender(envs.email, envs.passwordEmail)
    }

    async sendEmail({ to, subject, message, detectAutomatly = true, smtpServer = { smtpServer: 'smtp.gmail.com', port: 465 } }) {

        await this.emailSender.generateAndSendEmail({
            to,
            message,
            subject,
            smtpServer,
            detectAutomatly
        })
        return { success: true }

    }
}
