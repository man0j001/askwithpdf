import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { config } from 'dotenv';
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from 'stream';
import fs from 'fs'
import path from 'path'

config({ path: '.env' });

// Initialize S3 Client
export const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AMAZON_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  }
});

// Upload File to S3
export const streamS3upload = async (file: File) => {
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
  
  // Validate bucket name
  if (!bucketName) {
    throw new Error('Bucket name is missing or undefined');
  }

  const filePath = `uploads/${Date.now()}-${file.name.replace(' ', '-')}`
  try {
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: filePath,
        Body: file.stream(),
      },
    });

    // // Monitor upload progress
    // parallelUploads3.on("httpUploadProgress", (progress) => {
    //   console.log(progress);
    // });

    // Wait for upload to complete
    const data = await parallelUploads3.done();
    console.log('Successfully uploaded to S3!', filePath);

    return {
      file_path: filePath,
      file_name: file.name,
    };
    
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to S3');
  }
};


// Get S3 URL for the uploaded file
export const getS3Url = (fileKey: string): string => {
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AMAZON_REGION;

  if (!bucketName || !region) {
    throw new Error('Bucket name or region is missing');
  }

  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
};



export async function downloadFromS3(file_key: string): Promise<string | undefined> {
  try {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
      if (!bucketName) {
          throw new Error('Bucket name is missing or undefined');
      }

      const params = {
          Bucket: bucketName,
          Key: file_key,
      };
      const command = new GetObjectCommand(params);

      // Send the command to S3
      const { Body } = await s3.send(command);
      const dir = 'D:\\tmp';

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }

      const file_name = path.join(dir, `pdf-${Date.now().toString()}.pdf`);
      
      if (Body instanceof Readable) {
          const writeStream = fs.createWriteStream(file_name);
          
          // Return a promise that resolves when the stream finishes writing
          return new Promise((resolve, reject) => {
              Body.pipe(writeStream)
                  .on('finish', () => resolve(file_name))
                  .on('error', (error) => reject(error));
          });
      } else {
          throw new Error('Received invalid response from S3');
      }
      
  } catch (error) {
      console.error('Error downloading file:', error);
  }
}