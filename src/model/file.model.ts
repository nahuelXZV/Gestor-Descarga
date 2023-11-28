import { Socket } from "socket.io";
import { SocketObserver } from "../observer/SocketObserver.observer";
import { FileProxy } from "../proxy/fileProxy.proxy";
import { ZipCompressionStrategy } from "../strategy/zipCompression.strategy";
import { TarCompressionStrategy } from "../strategy/tarCompression.strategy";
import { CompressionInterface } from "../strategy/compressionInterface.strategy";
import { CompressContext } from "../strategy/compressContext.strategy";
import { LogsObserver } from "../observer/LogsObserver.observer";

export class FileModel {

    private fileProxy!: FileProxy;
    private socketObserver!: SocketObserver;
    private logsObserver!: LogsObserver;
    private compressContext!: CompressContext;
    private zipCompressionStrategy!: ZipCompressionStrategy;
    private tarCompressionStrategy!: TarCompressionStrategy;

    constructor() {
        this.zipCompressionStrategy = new ZipCompressionStrategy();
        this.zipCompressionStrategy = new TarCompressionStrategy();
    }

    getFiles(): String[] {
        const files: String[] = [
            "contabilidad.txt",
            "administracion.txt",
            "comunicados.txt",
            "contratos.txt",
            "log.txt",
            "notas.txt",
        ];
        return files;
    }

    async download(fileName: string, typeCompress: string, socket: Socket): Promise<Buffer> {
        // proxy
        this.fileProxy = new FileProxy();
        // observer
        this.socketObserver = new SocketObserver(socket);
        this.logsObserver = new LogsObserver(fileName);

        this.fileProxy.suscribe(this.socketObserver);
        this.fileProxy.suscribe(this.logsObserver);

        // strategy
        this.compressContext = new CompressContext();
        this.compressContext.setStrategy(this.getStrategy(typeCompress));

        const file = await this.fileProxy.download(fileName);
        const compressedContent = await this.compressContext.compress(file, fileName);
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











