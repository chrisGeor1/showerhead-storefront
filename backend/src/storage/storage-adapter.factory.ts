import { env } from '../env.js'
import type { StorageAdapter } from './adapters/storage-adapter.interface.js'
import { LocalStorageAdapter } from './adapters/local-storage.adapter.js'
import { MinioStorageAdapter } from './adapters/minio-storage.adapter.js'

function createStorageAdapter(): StorageAdapter {
  if (env.STORAGE_PROVIDER === 'minio') {
    return new MinioStorageAdapter()
  }
  return new LocalStorageAdapter()
}

export const storageAdapter: StorageAdapter = createStorageAdapter()

/** Call once at boot. No-ops for the local adapter. */
export async function initStorage(): Promise<void> {
  if (storageAdapter instanceof MinioStorageAdapter) {
    await storageAdapter.ensureBucket()
  }
}
