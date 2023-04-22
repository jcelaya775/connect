declare module "blob" {
  export class Blob {
    constructor(blobParts?: Array<BlobPart>, options?: BlobPropertyBag);
    readonly size: number;
    readonly type: string;
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number, end?: number, contentType?: string): Blob;
    stream(): ReadableStream;
    text(): Promise<string>;
  }
}
