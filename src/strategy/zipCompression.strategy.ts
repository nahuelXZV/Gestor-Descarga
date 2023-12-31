import { CompressionInterface } from "./compressionInterface.strategy";
import * as fs from 'fs';
import archiver from 'archiver';

export class ZipCompressionStrategy implements CompressionInterface {

    async compress(content: Buffer, fileName: string): Promise<Buffer> {
        try {
            // Crear un objeto Archiver
            const zip = archiver('zip');

            // Establecer el destino del archivo .zip
            const zipFileName = 'compressed/' + fileName + '.zip';
            const output = fs.createWriteStream(zipFileName);

            // Manejar eventos del objeto Archiver
            zip.on('error', function (err) {
                console.error('Error durante la compresión:', err);
                throw err;
            });

            output.on('error', function (err) {
                console.error('Error al escribir el archivo .zip:', err);
                throw err;
            });

            output.on('close', () => {
                console.log('Compresión completada.');
            });

            // Archivar el contenido
            zip.pipe(output);
            zip.append(content.toString(), { name: fileName });
            zip.finalize();

            // Esperar a que la compresión se complete antes de devolver el contenido
            await new Promise((resolve, reject) => {
                output.on('close', resolve);
                zip.on('error', reject);
            });

            const compressedContent = fs.readFileSync(zipFileName);
            return compressedContent;
        } catch (error) {
            console.error('Error al leer el archivo original:', error);
            throw error;
        }
    }
}