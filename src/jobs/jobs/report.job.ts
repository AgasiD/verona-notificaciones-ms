import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { Obra } from "../entities/obra.entity";
import { EmailSender } from "src/email/entities/Email.entity";
import { envs } from "src/config/envs";
import { Usuario } from "../entities/usuario.entity";
import { WhatsApp } from "src/whatsapp/entities/whatsapp.entity";
import { Tarea } from "../entities/tarea.entity";
import { SubEtapa } from "../entities/subetapa.entity";
import { Config } from "src/services/config/config.entity";
import { Logger } from "@nestjs/common";


export const verifica_enviarReporteSemanal = async (client: ClientProxy, config: Config) => {

    if (config.send_ws_reports != true) return

    Logger.log('Reporte semanal activado');
    await enviarReporteSemanal(client, [], config.obras_not_send_report);

}


const enviarReporteSemanal = async (client: ClientProxy, ids: string[] = [], not_ids: string[] = []) => {

    console.log('Enviando reporte semanal...');
    // let obras: Obra[] = await firstValueFrom(client.send('obras.obtenerObras', {}));
    // if (ids.length > 0) obras = obras.filter(obra => ids.includes(obra.id!));

    // if (not_ids.length > 0) obras = obras.filter(obra => !not_ids.includes(obra.id!));

    // const whataspp = new WhatsApp(envs.wsApiToken, envs.wsInstanceId);

    // let reporte_completo = '';
    // for (let obra of obras) {
    //     if (!not_ids.includes(obra.id!)) {
    //         try {
    //             obra.etapas = await firstValueFrom(client.send('obras.controlObra', { obraId: obra.id! }))
    //             const subetapas_response: SubEtapa[] = await firstValueFrom(client.send('subetapas.obtenerSubetapas', {}))

    //             let reporte = await generarReporteSemanal(obra, subetapas_response);
    //             if (reporte != null) {
    //                 switch (envs.isProduction) {
    //                     case false:
    //                         if (obra.idWSgroup) await whataspp.enviar_mensaje('5491166584411@c.us', reporte);
    //                         break;
    //                     default:
    //                         if (obra.idWSgroup) await whataspp.enviar_mensaje(obra.idWSgroup, reporte);
    //                         if (obra.idWScontacts && obra.idWScontacts.length > 0) {
    //                             for (let contact of obra.idWScontacts) {
    //                                  await whataspp.enviar_mensaje(contact, reporte);
    //                             }
    //                         }
    //                         break;
    //                 }
    //                 reporte_completo += `\n\n====${obra.nombre} - ${obra.lote}====`
    //                 reporte_completo += reporte;
    //             }
    //             console.log(`Mensajes enviados: ${obra.nombre}`)
    //         } catch (err) {
    //             console.log(`Error al enviar mensaje: ${obra.nombre}`)
    //         }
    //     }
    // }
    // ((await enviarReporteViaMail(client, reporte_completo))[0])

}


const generarReporteSemanal = async (obra: Obra, nombres_subetapas: SubEtapa[]) => {
    const hasta = new Date().getTime()
    const desde = hasta - (3600000 * 24 * 6);
    const encabezado = '\n\n¡Hola! Les envío el resumen de lo logrado esta semana 🏡\n\n';
    let tareas_realizadas: Tarea[] = []
    let subetapas_tareas: string[] = [];
    let texto: string = '';

    obra.etapas.forEach(
        etapa => {
            etapa.subetapas?.forEach(
                subetapa => {
                    subetapa.tareas?.forEach(
                        tarea => {
                            if ((!tarea.realizado && tarea.iniciado == true &&
                                ((
                                    tarea.tsIniciado! > desde && tarea.tsIniciado! < hasta
                                ) || (
                                        tarea.tsIniciado! < desde && tarea.tsIniciado! < hasta
                                    ))
                            ) || (tarea.realizado &&
                                (tarea.tsRealizado! >= desde &&
                                    tarea.tsRealizado! <= hasta))) {
                                tareas_realizadas.push(tarea);
                                subetapas_tareas.push(tarea.subetapa);
                            };
                        }
                    )
                }
            )
        }
    )


    if (tareas_realizadas.length > 0) {
        let sub_unrepeat = [...new Set(subetapas_tareas)];
        let subetapas: any[] = []
        for (const sub of sub_unrepeat) {
            const subetapa: SubEtapa = nombres_subetapas.find(subetapa => sub === subetapa.id)!;
            subetapas.push({
                id: sub,
                nombre: subetapa.descripcion
            })
        }

        texto += encabezado;
        if (tareas_realizadas.filter(t => t.realizado).length > 0) {
            texto += '\nLas siguientes tareas han sido finalizadas ✅ \n';


            for (let sub of subetapas) {
                let tareas_insertar = tareas_realizadas.filter(t => t.realizado && t.subetapa.includes(sub.id));
                if (tareas_insertar.length > 0) {

                    let nombre_subetapa = sub.nombre;
                    texto += `\n  _*${nombre_subetapa}*_  \n`
                    tareas_insertar.forEach(tarea => {
                        texto += `- ${tarea.descripcion} \n`
                    })
                }
            }
        }

        if (tareas_realizadas.filter(t => !t.realizado).length > 0) {
            texto += '\nLas siguientes tareas han sido iniciadas ☑️\n';
            for (let sub of subetapas) {
                let tareas_insertar = tareas_realizadas.filter(t => !t.realizado && t.subetapa.includes(sub.id));
                if (tareas_insertar.length > 0) {
                    let nombre_subetapa = sub.nombre;
                    texto += `\n  _*${nombre_subetapa}*_  \n`
                    tareas_insertar.forEach(tarea => {
                        texto += `- ${tarea.descripcion} \n`
                    })
                }
            }
        }
        texto += '\n¡Seguimos avanzando con los trabajos!';

    } else {
        texto = '';
    }
    return texto;

}

const enviarReporteViaMail = async (client: ClientProxy, reporte: string) => {
    const destinos = envs.isProduction
        ? [
            '-N1JMWIorvf_BK0dXi5k',// Martín Conti
            '-N1JMn2-R5mlliaJpG3r',// Federico Crivelli
            '-N1JTcvbeSczx-NsVWlz',// Tomás Gordillo
        ]
        : ['-N1BR-0DeEd6GvgGdgJt']// Damián Agasi


    const email = new EmailSender(envs.email, envs.passwordEmail);
    const asunto = `VERONA APP | Reporte semanal`

    try {
        for (let to of destinos) {
            const user: Usuario = await firstValueFrom(client.send('usuarios.obtenerUsuario', { usuarioId: to }));
            await email.generateAndSendEmail(
                {
                    message: reporte,
                    subject: asunto,
                    to: user.email,
                }
            );
        }
        return [true]
    } catch (err) {
        console.log(err);
        return [false, err]

    }
}
