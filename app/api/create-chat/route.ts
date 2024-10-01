import { loadS3IntoPinecone } from '@/lib/pinecone';
import { NextResponse } from 'next/server';
import { streamS3upload } from '@/lib/s3';



export async function POST(req: Request, res: Response) {

    try {
        const body = await req.formData();
        const file = body.get('file') as File;
        if (!req.body) {
            return NextResponse.json(
                { message: "File is Required", status: 400 }
            )
        }
        console.log(file)
        console.log("uploading....")
        const data = streamS3upload(file)
        console.log("Uploading Success")
        // const body = await req.json()
        // const { file_key, file_name } = body;
        // console.log("File key", file_key)
        // // const pages = await loadS3IntoPinecone(file_key)
        // // console.log(pages)

        return NextResponse.json(
            { message: "success", status: 200 }
        )

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );

    }

}