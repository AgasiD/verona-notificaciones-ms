
export class Config {

    id: string;
    send_ws_reports: boolean;
    schedule_send_report: string;
    schedule_backup: string;
    obras_not_send_report: string[];

    constructor(id, { send_ws_reports = true, schedule_send_report = '0 23 * * 5', schedule_backup = '20 23 * * 1-5', obras_not_send_report = [] }) {
        this.id = id;
        this.send_ws_reports = send_ws_reports;
        this.schedule_send_report = schedule_send_report;
        this.schedule_backup = schedule_backup;
        this.obras_not_send_report = obras_not_send_report
    }

}
