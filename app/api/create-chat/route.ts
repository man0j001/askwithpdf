import { loadS3IntoPinecone } from '@/lib/pinecone';
import { NextResponse } from 'next/server';



export async function POST(req: Request, res: Response) {

    try {
        const body = await req.json()
        const { file_key, file_name } = body;
        console.log("File key",file_key)
        // const pages = await loadS3IntoPinecone(file_key)
        // console.log(pages)

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