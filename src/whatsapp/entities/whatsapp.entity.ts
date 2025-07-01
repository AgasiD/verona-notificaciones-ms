import axios from "axios";

export class WhatsApp {
    apiToken: string;
    idInstance: string;
    url: string
    headers: any;
    constructor(API_TOKEN: string, ID_INSTANCE: string,) {
        this.apiToken = API_TOKEN;
        this.idInstance = ID_INSTANCE;
        this.url = 'https://waapi.app/api/v1/instances';
        this.headers = {
            'accept': 'application/json',
            'authorization': `Bearer ${this.apiToken}`,
            'content-type': 'application/json'
        };
    }

    async enviar_mensaje(to, mensaje) {
        const uri = `${this.url}/${this.idInstance}/client/action/send-message`;
        let body = {
            "chatId": to,
            "message": mensaje
        }
        let response = await axios.post(uri, body, this.headers);
        return response;
    }

    async obtener_chats() {
        const uri = `${this.url}/${this.idInstance}/client/action/get-chats`;
        let response = await axios.post(uri, {}, this.headers);
        return response;
    }

    async obtener_grupos() {

        const chats = (await this.obtener_chats()).data;
        const grupos = chats.data.data.filter(c => c.isGroup)

        return grupos;
    }


}









