import { Pinecone } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { downloadFromS3 } from "./s3Services";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

config({ path: '.env' });

// async function createIndex(client: Pinecone, indexName: string): Promise<void> {
//   try {
//     const index = await client.createIndex({
//       name: indexName,
//       dimension: 1536,
//       metric: "cosine",
//       spec: {
//         serverless: {
//           cloud: "aws",
//           region: "us-east-1",
//         },
//       },
//     });
//     console.log(
//       `Waiting for ${process.env.INDEX_INT_TIMEOUT} seconds for index initialization to complete...`
//     );
//     return index
//   } catch (error) {
//     console.log("error", error);
//     throw new Error("Index create Failed");
//   }
// }

export async function initializationPincone(){
  try {
    const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
    const indexName = "ask-to-pdf" ;
    // const index = await pc.createIndex({
    //   name: indexName,
    //   dimension: 1536,
    //   metric: "cosine",
    //   spec: {
    //     serverless: {
    //       cloud: "aws",
    //       region: "us-east-1",
    //     },
    //   },
    // });
    const index  = pc.index(indexName)
    return index

    // const existingIndexes = await pc.listIndexes();
    // const indexesArray = existingIndexes?.indexes || [];
    // const indexExists = indexesArray.some(
    //   (index: any) => index.name === indexName || index.name === "asktopdf"
    // );
    // if (!indexExists) {
    //   console.log(`Index '${indexName}' does not exist. Creating it...`);
    //   return createIndex(pc, indexName);
    // } else {
    //   console.log("Index is already created");
    // }
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

  const documents = await Promise.all(pages.map(splitPages));
  console.log("Spliting Complete")
  const vectors = await Promise.all(documents.flat().map(embedDocument));
  // const pineconeVector = initializationPincone()

  console.log("inserting vectors in pinecone")
  const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
  const indexName = "awswithpdf" ;
  const index  = pc.index(indexName)
  await index.namespace(convertToAscii(fileKey)).upsert(vectors)

  return documents[0]
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function splitPages(page:PDFPage){
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await textSplitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs

}


async function embedDocument(doc: Document){
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}