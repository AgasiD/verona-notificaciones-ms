import { HttpService } from "src/common/services/http/http.service";
import { envs } from "src/config/envs";


export class PushNotificactionService {

    uri: string;
    auth: Promise<any>

    constructor(
      private readonly http: HttpService
    ) {
        this.uri = envs.pushNotificationUri;
    }

    getAccessToken = async () => {
        // if(this.tokenVencido()){
        //     const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging', 'https://www.googleapis.com/auth/cloud-platform']
        //     this.auth = await new Promise(function (resolve, reject) {
        //         const key = require('../FirebaseCredentials.json');
        //         const jwtClient = new google.auth.JWT(
        //             key.client_email,
        //             null,
        //             key.private_key,
        //             SCOPES,
        //             null
        //         );
        //         jwtClient.authorize(function (err, tokens) {
        //             if (err) {
        //                 reject(err);
        //                 return;
        //             }
        //             resolve(tokens);
        //         });
        //     });
        // }
        // return this.auth.access_token;
    }

    // tokenVencido = async () => {

    //     if(this.auth == undefined){
    //         return true;
    //     }
    //     if(this.auth.expiry_date > Date.now()){
    //         return true
    //     }
    //     return false;

    // }



    async sendNotificationToOne(body = 'no body', title = 'no title', data = {}, to, auth_token) {
        const access_token = await this.getAccessToken();
        try {
            if (envs.isProduction) {
                let _http = HttpService;
                let bodySend =
                {
                    "message": {
                        "token": to,
                        "data": data,
                        "notification": {
                            "body": body,
                            "title": title
                        },
                        "android": {
                            "notification": {
                                "sound": "soundnotification.wav"
                            }
                        },
                        "apns": {
                            "payload": {
                                "aps": {
                                    "sound": "soundnotification.wav"
                                }
                            }
                        }
                    }
                }

                await this.http.post(`${envs.pushNotificationUri}`, {
                    "Authorization": `Bearer ${access_token}`
                }, bodySend);
            }
        }
        catch (err) {
            console.log('Error al enviar notificacion al dispositivo ' + to)
            // throw err 
        }
    }
}

