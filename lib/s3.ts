import {S3Client} from "@aws-sdk/client-s3";
import { config } from 'dotenv';
import  {Upload } from "@aws-sdk/lib-storage";
import fs from 'fs'

config({ path: '.env' });

export const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AMAZON_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  }
});

export const streamS3upload = async (file: File) => {
  const file_path = `uploads/${Date.now()}-${file.name.replace(' ', '-')}`;
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('Bucket name is missing or undefined');
  }
  try {
    console.time("uploadling");
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: file_path,
        Body: file.stream(),
      },
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    let data = await parallelUploads3.done();
    console.log(data);
    console.log('successfully uploaded to S3!', file_path);

    return {
      file_path,
      file_name: file.name,
    };
  } catch (error) {
    console.error('Error uploading file', error);
    throw new Error('Failed to upload file to S3');
  }
};

const getS3Url = async (file_key: string) => {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AMAZON_REGION}.amazonaws.com/${file_key}`;
  return url;
};
