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

// Pinecone Initialization 
export async function initializationPincone(){
  try {
    // Initialize a Pinecone client once per cold start; reuse across calls via module scope.
    const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
    const indexName = "askwithpdf" ;
    // NOTE: createIndex is not idempotent; callers should ensure the index exists
    // only once (or move this behind a one-time admin task).
    await pc.createIndex({
      name: indexName,
      dimension: 768, // Replace with your model dimensions
      metric: 'cosine', // Replace with your model metric
      spec: { 
        serverless: { 
          cloud: 'aws', 
          region: 'us-east-1' 
        }
      } 
    });
    return pc.index(indexName)

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
// downloading PDF from S3 bucket
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
// Parsing the PDF
  const loader = new PDFLoader(file_name);
  // Loader returns pages with text and page metadata; we keep page numbers for citations.
  const pages = (await loader.load()) as PDFPage[];
//Spliting the Parsed Text
  // Split each page into overlapping chunks to improve semantic recall during retrieval.
  const documents = await Promise.all(pages.map(splitPages));
  console.log("Spliting Complete")
//Convert the splitted text into vector
  // Embed chunks concurrently; ensure the embedding dimensionality matches the index.
  const vectors = await Promise.all(documents.flat().map(embedDocument));

// Store the vector in Pincone by intiaziation`s then create index 
  const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
  const indexName = "askwithpdf" ;
  // const index = await initializationPincone()
  const index  = pc.index(indexName)
  //Creates file-specific namespace using ASCII-converted fileKey
  //Upserts all vectors to the namespace

  // Use a per-file namespace so multiple PDFs can coexist without id collisions.
  // convertToAscii ensures the namespace is valid for Pinecone.
  await index.namespace(convertToAscii(fileKey)).upsert(vectors)

  return documents[0]
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  // Truncate by bytes (not code points) to respect upstream size limits reliably.
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};
// spliting the pdf into document using Text Splitter
async function splitPages(page:PDFPage){
  let pageContent = page.pageContent;
  const { metadata } = page;
  // Normalize whitespace; stripping newlines helps the splitter produce cleaner chunks.
  pageContent = pageContent.replace(/\n/g, "");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 150,
  });
  const docs = await textSplitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        // Keep a truncated copy of the chunk for fast preview/snippets and citation context.
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs

}


async function embedDocument(doc: Document){
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    // Deterministic id: content hash avoids duplicate vectors for identical chunks.
    // Collisions are extremely unlikely but possible; consider adding page/offset if needed.
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        // Store minimally necessary metadata for downstream citation rendering.
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    // Surface embedding failures so upstream callers can retry or dead-letter the job.
    console.log("error embedding document", error);
    throw error;
  }
}