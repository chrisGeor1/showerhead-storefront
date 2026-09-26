import fs from 'node:fs/promises'
import path from 'node:path'
import { env } from '../../env.js'
import type { StorageAdapter, UploadInput, UploadResult } from './storage-adapter.interface.js'

export class LocalStorageAdapter implements StorageAdapter {
  readonly provider = 'LOCAL' as const
  private readonly rootDir: string

  constructor(rootDir = env.STORAGE_LOCAL_DIR) {
    this.rootDir = rootDir
  }

  async upload(input: UploadInput): Promise<UploadResult> {
    const filePath = path.join(this.rootDir, input.key)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, input.buffer)
    return { key: input.key, url: this.getPublicUrl(input.key) }
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.rootDir, key)
    await fs.rm(filePath, { force: true })
  }

  getPublicUrl(key: string): string {
    return new URL(`/uploads/${key}`, env.PUBLIC_API_URL).toString()
  }
}
