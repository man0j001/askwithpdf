import AWS from 'aws-sdk';
import { config } from 'dotenv';

config({ path: '.env' });

export const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AMAZON_REGION,
});

const s3upload = async (file: File) => {
  const file_key = 'upload' + Date.now().toString() + file.name.replace(' ', '-');
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('Bucket name is missing or undefined');
  }

  const params = {
    Bucket: bucketName,
    Key: file_key,
    Body: file,
  };

  try {
    const upload = s3
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        if (evt.total) {
          console.log(
            'uploading to s3...',
            `${parseInt(((evt.loaded * 100) / evt.total).toString())}%`
          );
        }
      })
      .promise();

    await upload;
    console.log('successfully uploaded to S3!', file_key);

    return {
      file_key,
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

export {s3}