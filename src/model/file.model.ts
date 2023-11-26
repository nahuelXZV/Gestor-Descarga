import { Socket } from "socket.io";
import { SocketObserver } from "../observer/SocketObserver.observer";
import { FileProxy } from "../proxy/fileProxy.proxy";
import { ZipCompressionStrategy } from "../strategy/zipCompression.strategy";
import { TarCompressionStrategy } from "../strategy/tarCompression.strategy";
import { CompressionInterface } from "../strategy/compressionInterface.strategy";
import { CompressContext } from "../strategy/compressContext.strategy";
import { LogsObserver } from "../observer/LogsObserver.observer";

export class FileModel {

    getFiles(): String[] {
        const files: String[] = [
            "patrones.pdf",
            "contabilidad.txt",
        ];
        return files;
    }

    async download(fileName: string, typeCompress: string, socket: Socket): Promise<Buffer> {
        // proxy
        const fileProxy = new FileProxy();
        // observer
        const socketObserver = new SocketObserver(socket);
        const logsObserver = new LogsObserver(fileName);

        fileProxy.suscribe(socketObserver);
        fileProxy.suscribe(logsObserver);

        // strategy
        const compressContext = new CompressContext();
        compressContext.setStrategy(this.getStrategy(typeCompress));

        const file = await fileProxy.download(fileName);
        const compressedContent = await compressContext.compress(file, fileName);
        return compressedContent;
    }

    private getStrategy(typeCompress: string): CompressionInterface {
        switch (typeCompress) {
            case 'zip':
                return new ZipCompressionStrategy();
            case 'tar':
                return new TarCompressionStrategy();
            default:
                throw new Error('No existe estrategia');
        }
    }
}











