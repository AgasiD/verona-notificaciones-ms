
import { getFullDate } from "src/common/helpers/helper";
import { envs } from "src/config/envs";
import { EmailSender } from "src/email/entities/Email.entity";
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from "rxjs";

export const obtenerBackup = async (client: ClientProxy) => {

    const emailSender = new EmailSender(envs.email, envs.passwordEmail);
    try {

        console.log('Recuperando base de datos...');

        const response_backup = await firstValueFrom(client.send('files.backup', { backupFolderId: envs.rootBackupFolder }))
        if (!response_backup.success)
            throw new Error(response_backup.message)

        console.log('Base de datos grabada')

    } catch (err) {
        emailSender.generateAndSendEmail({
            message: err.message,
            subject: `ERROR - BackUp Verona - ${getFullDate()} `,
            to: 'agasidamian@gmail.com',
        })

    }
}