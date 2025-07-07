import { Inject, Injectable } from '@nestjs/common';
import { obtenerBackup } from './jobs/backup.job';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from './entities/Cron';
import { ConfigService } from 'src/services/config/config.service';
import { verifica_enviarReporteSemanal } from './jobs/report.job';

@Injectable()
export class JobsService {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
        private readonly configService: ConfigService
    ) {
        this.initJobs();

    }

    async initJobs() {
        const config = await this.configService.load_config();
        const cron = new Cron();
        cron.nuevo_job({
            tiempo: config.schedule_backup,
            callback: async () => await obtenerBackup(this.client)
        })

        cron.nuevo_job({
            tiempo: config.schedule_send_report,
            callback: async () => {
                await verifica_enviarReporteSemanal(this.client, config);
            }
        })

    }
}

