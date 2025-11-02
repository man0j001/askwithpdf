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
    const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
    const indexName = "askwithpdf" ;
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
  const pages = (await loader.load()) as PDFPage[];
//Spliting the Parsed Text
  const documents = await Promise.all(pages.map(splitPages));
  console.log("Spliting Complete")
//Convert the splitted text into vector
  const vectors = await Promise.all(documents.flat().map(embedDocument));

// Store the vector in Pincone by intiaziation`s then create index 
  const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
  const indexName = "askwithpdf" ;
  // const index = await initializationPincone()
  const index  = pc.index(indexName)
  //Creates file-specific namespace using ASCII-converted fileKey
  //Upserts all vectors to the namespace

  await index.namespace(convertToAscii(fileKey)).upsert(vectors)

  return documents[0]
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};
// spliting the pdf into document using Text Splitter
async function splitPages(page:PDFPage){
  let pageContent = page.pageContent;
  const { metadata } = page;
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