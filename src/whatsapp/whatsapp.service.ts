
import { HttpService } from "src/common/services/http/http.service";
import { envs } from "src/config/envs";


export class WaapiService {
  API_TOKEN: string;
  ID_INSTANCE: string;
  URL: string;
  HEADERS: any;

    constructor(private readonly http: HttpService) {
        this.API_TOKEN =  envs.wsApiToken;
        this.ID_INSTANCE = envs.wsInstanceId;
        this.URL = 'https://waapi.app/api/v1/instances';
        this.HEADERS = { 
            'accept': 'application/json',
            'authorization': `Bearer ${this.API_TOKEN}`,
            'content-type': 'application/json'
         };
    }

    //\\\\\\\\\\\\\\\\\\\ SEND MESSAGES \\\\\\\\\\\\\\\\\\\\\
    
    enviarMensaje = async (to, message) => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/send-message`;
        let body = { 
            "chatId": to, 
            "message": message }
        let response = await this.http.post(uri, this.HEADERS, body);
        return response;
    }


    enviarMedia = async (to, message, mediaPath) => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/send-media`;
        let body = {
            chatId: to,
            mediaUrl: mediaPath,
            mediaCaption: message
        }
        let response = await this.http.post(uri, this.HEADERS, body);
        return response;
    }
    enviarLocation = async (to, longitude, latitude) => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/send-location`;
        let body = {
            chatId: to,
            longitude: Number(longitude),
            latitude: Number(latitude)
        }
        let response = await this.http.post(uri, this.HEADERS, body);
        return response;
    }

    enviarContact = async (to,contactNumber, firstname, displayname) => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/send-vcard`;
        let body = {
            chatId: to,
            vCard: {
                waid: contactNumber,
                iternationalnumber:contactNumber,
                firstname: firstname,
                displayname: displayname
            }
        }
        let response = await this.http.post(uri, this.HEADERS, body);
        return response;
    }


    /////////////////// GET INFO  //////////////////////

    obtenerPerfil = async (contactId) => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/get-contact-by-id`;
        let body = { contactId: contactId }
        let response = await this.http.post(uri, this.HEADERS, body);
        return response;
    }

    obtenerChats = async () => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/get-chats`;
        let response = await this.http.post(uri, this.HEADERS, {});
        return response;
    }

    obtenerMensajesByChat = async (chatID, { limit = undefined, fromMe = true, includeMedia = true }) => {
        const uri = `${this.URL}/${this.ID_INSTANCE}/client/action/fetch-messages`;
        const body = {
            chatID,
            fromMe,
            includeMedia
        }
        let response = await this.http.post(uri, this.HEADERS, {});
        return response;
    }

    


}





