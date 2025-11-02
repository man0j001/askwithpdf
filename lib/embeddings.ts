import { GoogleGenAI } from "@google/genai";

// Initialize Google Gemini AI client
// Get your API key from https://ai.google.dev/
const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_EMBEDDING_API_KEY
});

export async function getEmbeddings(text: string) {
  try {
    if (!process.env.GOOGLE_EMBEDDING_API_KEY) {
      throw new Error("GOOGLE_EMBEDDING_API_KEY is not set in environment variables");
    }

    // Clean the input text
    const cleanedText = text.replace(/\n/g, " ").trim();

    // Generate embeddings using gemini-embedding-001 model
    // Output dimension set to 1024 to match Pinecone index
    const result = await client.models.embedContent({
      model: 'gemini-embedding-001',
      contents: cleanedText,
      config: {
        outputDimensionality: 1024
      }
    });

    // Check if embeddings exist and return the values
    if (!result.embeddings || result.embeddings.length === 0) {
      throw new Error("No embeddings returned from the API");
    }

    // Return the embedding values
    return result.embeddings[0].values as number[];
  } catch (error) {
    console.log("Error calling Google Gemini embeddings API:", error);
    throw error;
  }
}
