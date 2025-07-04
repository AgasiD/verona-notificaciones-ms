import { sign } from 'crypto';
import 'dotenv/config';
import * as joi from 'joi'

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string[];
    GOOGLE_URI: string;
    SIGN: string,
    WS_API_TOKEN: string,
    WS_API_INSTANCE_ID: string,
    PUSH_NOTIFICATION_URI: string,
    EMAIL: string,
    PASSWORD_EMAIL: string,
    ROOT_BACKUP_FOLDER: string,
    ISPRODUCTION: boolean,
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    GOOGLE_URI: joi.string().uri().required(),
    WS_API_TOKEN: joi.string().required(),
    WS_API_INSTANCE_ID: joi.string().required(),
    PUSH_NOTIFICATION_URI: joi.string().required(),
    EMAIL: joi.string().required(),
    PASSWORD_EMAIL: joi.string().required(),
    ROOT_BACKUP_FOLDER: joi.string().required(),
    ISPRODUCTION: joi.boolean().required(),
}).unknown(true)

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),

})
if (error) {
    throw new Error('Config validation error: ' + error.message)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    googleURI: envVars.GOOGLE_URI,
    sign: envVars.SIGN,
    wsApiToken: envVars.WS_API_TOKEN,
    wsInstanceId: envVars.WS_API_INSTANCE_ID,
    pushNotificationUri: envVars.PUSH_NOTIFICATION_URI,
    email: envVars.EMAIL,
    passwordEmail: envVars.PASSWORD_EMAIL,
    rootBackupFolder: envVars.ROOT_BACKUP_FOLDER,
    isProduction: envVars.ISPRODUCTION
}

