import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { env } from '../../env.js'
import type { StorageAdapter, UploadInput, UploadResult } from './storage-adapter.interface.js'

export class MinioStorageAdapter implements StorageAdapter {
  readonly provider = 'MINIO' as const
  private readonly client: S3Client
  private readonly bucket: string

  constructor() {
    this.bucket = env.STORAGE_BUCKET
    this.client = new S3Client({
      endpoint: env.STORAGE_ENDPOINT,
      region: env.STORAGE_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY,
        secretAccessKey: env.STORAGE_SECRET_KEY,
      },
    })
  }

  /** Creates the bucket and makes it public-read if it doesn't already exist. Call once on boot. */
  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }))
      return
    } catch {
      // bucket doesn't exist yet — fall through and create it
    }

    await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }))
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    }
    await this.client.send(
      new PutBucketPolicyCommand({ Bucket: this.bucket, Policy: JSON.stringify(policy) }),
    )
  }

  async upload(input: UploadInput): Promise<UploadResult> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: input.buffer,
        ContentType: input.contentType,
      }),
    )
    return { key: input.key, url: this.getPublicUrl(input.key) }
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }

  getPublicUrl(key: string): string {
    return `${env.STORAGE_PUBLIC_URL}/${key}`
  }
}
