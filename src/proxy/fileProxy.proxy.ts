import { DownloadObserver } from "../observer/DownloadInterface.observer";
import { FileInterface } from "./fileInterface.proxy";
import { RealFile } from "./realFIle.proxy";
import fs from 'fs';

export class FileProxy implements FileInterface {
    private realFile: RealFile | null = null;
    private observers: DownloadObserver[] = [];

    suscribe(observer: DownloadObserver): void {
        this.observers.push(observer);
    }

    unSuscribe(observer: DownloadObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    async download(fileName: string): Promise<Buffer> {
        if (!this.validateFile(fileName)) return Buffer.from('');
        if (!this.realFile) this.realFile = new RealFile();

        let downloadPromise = await this.realFile.download(fileName);
        const percentages = [20, 50, 75, 100];
        for (let i = 0; i < percentages.length; i++) {
            if (percentages[i] < 100 || !this.realFile.isDownloadFulfilled()) {
                this.notifyObservers(percentages[i]);
            } else {
                this.notifyObservers(100);
                console.log('Descarga completa');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return downloadPromise;
    }

    private validateFile(fileName: string): boolean {
        if (!fs.existsSync("files/" + fileName)) {
            console.log('El archivo no existe');
            return false;
        }
        return true;
    }

    private notifyObservers(progress: number): void {
        this.observers.forEach(observer => observer.update(progress));
    }
}