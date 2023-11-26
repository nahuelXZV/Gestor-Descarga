import fs from 'fs';

export class RealFile {
    private dir: string = 'files/';
    private isFulfilled: boolean = false;

    async download(fileName: string): Promise<Buffer> {
        this.isFulfilled = false;
        const content = await fs.promises.readFile(this.dir + fileName);
        this.isFulfilled = true;
        return content;
    }

    isDownloadFulfilled(): boolean {
        return this.isFulfilled;
    }
}