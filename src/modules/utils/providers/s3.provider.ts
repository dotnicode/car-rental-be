import { envs } from 'src/config/envs';

import { S3, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

/*
 * Crear el bucket previamente con el comando `awslocal s3 mb s3://nombre-del-bucket`
 */

@Injectable()
export class S3ConfigProvider {
  private readonly _s3: S3Client;
  private readonly _bucketName: string;

  constructor() {
    this._bucketName = envs.AWS_S3_BUCKET_NAME;
    this._s3 = new S3Client({
      credentials: {
        accessKeyId: envs.AWS_ACCESS_KEY_ID,
        secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: envs.AWS_ENDPOINT,
      forcePathStyle: true,
      region: envs.AWS_REGION,
      logger: console,
      maxAttempts: 3,
      retryMode: 'standard',
    });
  }

  get client(): S3Client {
    return this._s3;
  }

  get bucketName(): string {
    return this._bucketName;
  }
}
