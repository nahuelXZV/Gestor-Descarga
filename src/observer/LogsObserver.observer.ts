
import { DownloadObserver } from "./DownloadInterface.observer";
import * as fs from 'fs';

export class LogsObserver implements DownloadObserver {
    private fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    update(progress: number) {
        if (progress === 100) {
            const date = new Date();
            const logMessage = `Archivo: ${this.fileName}, Hora: ${date.getHours()}:${date.getMinutes()}, Fecha: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}\n`;
            fs.appendFile('logs/log.txt', logMessage, (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo de logs:', err);
                } else {
                    console.log('Log guardado:', logMessage);
                }
            });
        }
    }
}