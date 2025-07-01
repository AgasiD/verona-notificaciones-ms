import { Injectable } from '@nestjs/common';
import { HttpService } from 'src/common/services/http/http.service';
import { envs } from 'src/config/envs';
import { Config } from './config.entity';
import { getDataFromJSON } from 'src/common/helpers/helper';

@Injectable()
export class ConfigService {

    uri: string;
    constructor(private readonly http: HttpService) {
        this.uri = envs.googleURI + '/config';
    }

    async create_config() {
        const config = new Config('', {});
        const response = await this.http.post(`${this.uri}.json`, {}, config);
        if (response.status >= 300) throw new Error('Error al grabar Config ' + response.statusText);
        
        return config;
    }

    async load_config(): Promise<Config>{

        const response = await this.http.get(`${this.uri}.json`);
        let aux_config = response.data;
        let config;
        if (aux_config != undefined && typeof aux_config != 'string') {
            const data = getDataFromJSON(aux_config)[0];
            config = new Config(data.id, data.attributes);
        } else {
            config = await this.create_config();
        }

        return config;
    }


    async update_config(config) {
        // const { id, ...resto } = config;

        // const response = await httpService.put(`${this.uri}/${id}.json`, {}, resto);
        // this.config = config;
        // return this.config;

    }



}
