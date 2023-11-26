import archiver from 'archiver';
import * as fs from 'fs';

export class TuClase {
    private dir: string = 'files/';
    private isFulfilled: boolean = false;

    async downloadAndCompress(fileName: string): Promise<Buffer> {
        this.isFulfilled = false;

        try {
            const content = await fs.promises.readFile(this.dir + fileName);

            // Crear un objeto Archiver
            const zip = archiver('zip');

            // Establecer el destino del archivo .zip
            const zipFileName = this.dir + fileName + '.zip';
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
                this.isFulfilled = true;
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

    // Resto de tu clase y métodos...
}
