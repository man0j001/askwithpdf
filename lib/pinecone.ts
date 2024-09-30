import { Pinecone } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { downloadFromS3 } from "./s3-server";

config({ path: '.env' });

async function createIndex(client: Pinecone, indexName: string): Promise<void> {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log(
      `Waiting for ${process.env.INDEX_INT_TIMEOUT} seconds for index initialization to complete...`
    );
  } catch (error) {
    console.log("error", error);
    throw new Error("Index create Failed");
  }
}

export async function initializationPincone(): Promise<Pinecone> {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
    const indexName = process.env.PINECONE_INDEX_NAME ;

    const existingIndexes = await pc.listIndexes();
    const indexesArray = existingIndexes?.indexes || [];
    const indexExists = indexesArray.some(
      (index: any) => index.name === indexName || index.name === "asktopdf"
    );

    // if (!indexExists) {
    //   console.log(`Index '${indexName}' does not exist. Creating it...`);
    //   createIndex(pc, indexName);
    // } else {
    //   console.log("Index is already created");
    // }
    return pc;
  } catch (error) {
    console.log("error", error);
    throw new Error("Faile to Initialization of Pinecone");
  }
}

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
}