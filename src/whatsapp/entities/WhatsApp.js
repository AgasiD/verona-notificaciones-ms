const WaapiService = require("../services/WaapiService")

class WhatsApp {
    constructor() {
        this.service = new WaapiService();
    }

    async enviar_mensaje(to, mensaje) {
        await this.service.enviarMensaje(to, mensaje);
    }

    async obtener_chats() {
        return await this.service.obtenerChats();
    }


    async obtener_chat() {
        return await this.service.obtenerChat();
    }

    async obtener_grupos() {

        const chats = (await this.obtener_chats()).data;
        const grupos = chats.data.data.filter(c => c.isGroup)
        // .map(e => ({ "name": e.name, "id": e.id.user }));

        // const grupos = grupos.filter(g => g.name?.includes('Verano App'))

        return grupos;
    }


}

module.exports = WhatsApp