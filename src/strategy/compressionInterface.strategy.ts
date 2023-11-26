export interface CompressionInterface {
  compress(content: Buffer, fileName: string): Buffer | Promise<Buffer>;
}