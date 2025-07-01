import { createTransport } from 'nodemailer';

export class EmailSender {
    private username;
    private password;
    constructor(username, password,) {
        this.username = username;
        this.password = password;
    }

    async generateAndSendEmail({ to, subject, message, detectAutomatly = true, smtpServer = { smtpServer: 'smtp.gmail.com', port: 465 } }) {

        let smtp;
        if (detectAutomatly) {
            smtpServer = this.detectSmtpServer(this.username);
        } else {
            smtp = smtpServer
        }

        if (!smtpServer) {
            throw new Error('SMTP server not supported for the given email address.');
        }

        const email = {
            from: this.username,
            to: to,
            subject: subject,
            message: message
        };

        let response = await this.sendEmail({ smtpServer, email, username: this.username, password: this.password });
        return response;
    }

    private detectSmtpServer(username) {
        const emailDomain = username.split('@')[1];
        switch (emailDomain) {
            case 'gmail.com':
                return { smtpServer: 'smtp.gmail.com', port: 465 };
            case 'yahoo.com':
                return { smtpServer: 'smtp.mail.yahoo.com', port: 465 };
            case 'hotmail.com':
                return { smtpServer: 'smtp.live.com', port: 587 };
            case 'outlook.com':
                return { smtpServer: 'smtp-mail.outlook.com', port: 587 };
            default:
                return { smtpServer: 'smtp.gmail.com', port: 465 };
        }
    }

    private async sendEmail({ smtpServer, email, username, password }) {

        const transporter = createTransport({
            host: smtpServer.smtpServer,
            port: smtpServer.port,
            secure: true,
            auth: {
                user: username,
                pass: password
            }
        });

        let response = await transporter.sendMail({
            from: email.from,
            to: email.to,
            subject: email.subject,
            text: email.message
        });
        return response;
    }
}