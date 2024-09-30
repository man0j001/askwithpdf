// import {s3} from "./s3";
import { config } from 'dotenv';
import fs from 'fs'

config({ path: '.env' });


export async function downloadFromS3(file_key:string) {
    try {
        const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('Bucket name is missing or undefined');
    }
  
    const params = {
      Bucket: bucketName,
      Key: file_key,
    };
    const obj = await s3.getObject(params).promise();
    const file_name = `/tmp/pdf${Date.now().toString()}.pdf`
    fs.writeFileSync(file_name, obj.Body as Buffer)
    return file_name;

    } catch (error) {
        console.log(error)
    }

    
}