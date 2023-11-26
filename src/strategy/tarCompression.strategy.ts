import { CompressionInterface } from "./compressionInterface.strategy";
import * as fs from 'fs';
import archiver from 'archiver';

export class TarCompressionStrategy implements CompressionInterface {

    async compress(content: Buffer, fileName: string): Promise<Buffer> {
        try {
            // Crear un objeto Archiver
            const tar = archiver('tar');

            // Establecer el destino del archivo .tar
            const tarFileName = 'compressed/' + fileName + '.tar';
            const output = fs.createWriteStream(tarFileName);

            // Manejar eventos del objeto Archiver
            tar.on('error', function (err) {
                console.error('Error durante la compresión:', err);
                throw err;
            });

            output.on('error', function (err) {
                console.error('Error al escribir el archivo .tar:', err);
                throw err;
            });

            output.on('close', () => {
                console.log('Compresión completada.');
            });

            // Archivar el contenido
            tar.pipe(output);
            tar.append(content, { name: fileName });
            await tar.finalize();

            // Leer el archivo .tar y devolverlo como Buffer
            const compressedFile = await fs.promises.readFile(tarFileName);
            return compressedFile;
        } catch (err) {
            console.error('Error durante la compresión:', err);
            throw err;
        }
    }
}