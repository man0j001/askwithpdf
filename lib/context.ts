import { Pinecone } from "@pinecone-database/pinecone";
import { config } from 'dotenv';
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

/**
 * Utilities for building contextual prompts from Pinecone vector matches.
 *
 * Flow:
 * 1) getEmbeddings(query) → query vector
 * 2) getMatchEmbedding(vector, fileKey) → top-K matches from Pinecone
 * 3) getContext(query, fileKey) → structured context text + per-chunk metadata (pageNumber, score)
 */

config({ path: '.env' });

// getMatchEmbedding function is used to find query emebeddings in existing pinecone and return top 5 results
/**
 * Query Pinecone for top-K matches in the namespace for a given file.
 */
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


/**
 * A single contextual source paragraph/snippet used to ground the model.
 */
export type ContextSource = {
    id: string;
    text: string;
    pageNumber: number;
    score: number;
};

/**
 * Result structure returned by getContext: plain text for the prompt and structured sources for citations.
 */
export type ContextResult = {
    contextText: string;
    sources: ContextSource[];
};

//getContext function is use to get embedding from together.ai and get top 5 matching result from pinecone
//then filter out those matches which has score greater then 0.7 and return structured context with metadata
/**
 * Build prompt context by embedding the query, retrieving similar chunks from Pinecone,
 * and returning both a human-readable context block and structured source metadata.
 */
export async function getContext(query:string,fileKey:string): Promise<ContextResult> {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchEmbedding(queryEmbeddings,fileKey);

    type Metadata = { 
        text?: string;
        pageNumber?: number;
      };

    const filteredMatches = matches.filter((match) => (match.score ?? 0) > 0.7);
    const relevantMatches = (filteredMatches.length ? filteredMatches : matches).slice(0, 5);

    const sources = relevantMatches
        .map((match, index) => {
            const metadata = match.metadata as Metadata | undefined;
            const text = metadata?.text?.trim();
            if (!text) return null;
            return {
                id: `source-${index + 1}`,
                text,
                pageNumber: metadata?.pageNumber ?? 1,
                score: match.score ?? 0,
            } satisfies ContextSource;
        })
        .filter((source): source is ContextSource => Boolean(source));

    const contextText = sources
        .map((source, index) => `Source ${index + 1} (Page ${source.pageNumber}): ${source.text}`)
        .join("\n\n");

    return {
        contextText,
        sources,
    };
}