export type StorageProviderName = 'LOCAL' | 'MINIO'

export interface UploadInput {
  key: string
  buffer: Buffer
  contentType: string
}

export interface UploadResult {
  key: string
  url: string
}

/**
 * Abstraction over where uploaded media actually lives. MinioStorageAdapter
 * (S3-compatible, runs in Docker) is the default; LocalStorageAdapter is a
 * zero-dependency fallback that writes to disk and is served back out via
 * an Express static route.
 */
export interface StorageAdapter {
  readonly provider: StorageProviderName
  upload(input: UploadInput): Promise<UploadResult>
  delete(key: string): Promise<void>
  getPublicUrl(key: string): string
}
