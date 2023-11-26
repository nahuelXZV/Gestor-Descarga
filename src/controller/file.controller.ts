import { Request, Response } from 'express';
import { Socket } from 'socket.io';

import { FileView } from '../view/file.view';
import { FileModel } from '../model/file.model';

export interface downloadOptions {
    typeCompress: string;
    fileName: string;
}

export class FileController {
    private fileView: FileView | undefined;
    private fileModel: FileModel | undefined;

    public index = async (req: Request, res: Response) => {
        this.fileModel = new FileModel();
        const files: String[] = this.fileModel.getFiles();
        this.fileView = new FileView(req, res);
        this.fileView.render({ files });
    };

    public download = async (req: Request, res: Response, socket: Socket) => {
        const { typeCompress, fileName } = req.body;
        const fileView = new FileView(req, res);
        this.fileModel = new FileModel();
        const compressedContent = await this.fileModel.download(fileName, typeCompress, socket);
        const nameZip = fileName + '.' + typeCompress;
        fileView.sendData(nameZip, compressedContent, typeCompress);
    };


}