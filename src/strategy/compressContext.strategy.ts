import { CompressionInterface } from "./compressionInterface.strategy";

export class CompressContext {
    private strategy!: CompressionInterface;

    setStrategy(strategy: CompressionInterface): void {
        this.strategy = strategy;
    }

    async compress(file: Buffer, fileName: string): Promise<Buffer> {
        return await this.strategy.compress(file, fileName);
    }

}
