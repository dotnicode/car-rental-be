/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { randomUUID } from 'crypto';

import { PutObjectCommand } from '@aws-sdk/client-s3';

import { S3ConfigProvider } from '../providers/s3.provider';

export const uploadPicture = async (file: Express.Multer.File) => {
  const s3 = new S3ConfigProvider();
  const pictureKey = randomUUID();

  await s3.client.send(
    new PutObjectCommand({
      Bucket: s3.bucketName,
      Key: pictureKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return {
    pictureKey,
    imageUrl: `http://localhost:4566/${s3.bucketName}/${pictureKey}`,
  };
};
