import { loadS3IntoPinecone } from '@/lib/pinecone';
import { NextResponse } from 'next/server';
import { getS3Url, streamS3upload } from '@/lib/s3Services';
import { db } from '@/lib/db';
import { chatTable } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';




export async function POST(req: Request) {
    const { userId }: { userId: string | null } = auth()

    if (!userId) return NextResponse.json({error:" Unauthorised "}, { status: 401 })

    try {
        const body = await req.formData();
        const file = body.get('file') as File;
        if (!req.body) {
            return NextResponse.json(
                { message: "File is Required", status: 401 }
            )
        }
        //upload the pdf data to AWS S3 
        const data = await streamS3upload(file)
        console.log("Uploading Success")
        const { file_path, file_name } = data
        //convert send uploaded pdf to Pinecone DB
        await loadS3IntoPinecone(file_path)

        const chat_id = await db.insert(chatTable).values({
            fileKey: file_path,
            pdfName: file_name,
            pdfUrl:getS3Url(file_path),
            userID:userId
        } 
        ).returning({insertedId:chatTable.id})

        return NextResponse.json({chat_id:chat_id[0].insertedId},{status:200})

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );

    }

}