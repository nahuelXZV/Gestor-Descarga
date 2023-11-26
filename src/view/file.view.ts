import { Request, Response } from 'express';

export interface FileOptions {
    files: String[];
}

export class FileView {

    private view = 'index';
    private res: Response;
    private req: Request;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    render(fileOptions: FileOptions) {
        const { files } = fileOptions;
        return this.res.render(this.view, { files });
    }

    sendData(fileName: string, compressedContent: Buffer, typeCompress: string = 'zip') {
        this.res.setHeader('Content-Type', 'application/' + typeCompress);
        this.res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
        this.res.send(compressedContent);
    }

}
