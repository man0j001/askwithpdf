import { Pinecone } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { match } from "assert";
import { metadata } from "@/app/layout";
import { log } from "console";

config({ path: '.env' });

// getMatchEmbedding function is used to find query emebeddings in existing pinecone and return top 5 results
export async function getMatchEmbedding(embeddings: number[], fileKey: string) {
    try {
        //initialize Pinecone
        const pc = new Pinecone({ apiKey: process.env.PINEONE_API_KEY as string });
        //get index from pinecode
        const index = pc.index("askwithpdf")
        //get right namespace using filekey for searching emeddings
        const namespace = index.namespace(convertToAscii(fileKey))
        
        //searching top 5 matches from emebeddings
        const queryResult = await namespace.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        })
        return queryResult.matches || []
    }
    catch (error) {
        console.log("error querying embeddings", error);
        throw error;
    }
}


//getContext function is use to get embedding from together.ai and get top 5 matching result from pinecone
//then filter out those matches which has score greater then 0.7 and return only 3000 string
export async function getContext(query:string,fileKey:string) {
    const queryEmbeddings = await getEmbeddings(query)
    const matches = await getMatchEmbedding(queryEmbeddings,fileKey);
    const qualifyingMatches = matches.filter((match)=>
        match.score && match.score > 0.7
    )
    type Metadata = { 
        text: string;
        pageNumber: number;
      };
    
    let docs = matches.map((match) => (match.metadata as Metadata).text);
    return docs.join("\n").substring(0,3000)

    
}