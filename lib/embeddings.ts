
import Together from "together-ai";
import { config } from 'dotenv';



const together = new Together({
  apiKey: process.env.TOGETHER_AI,
});

export async function getEmbeddings(text: string) {
  try {
    const response = await together.embeddings.create({
      model: 'togethercomputer/m2-bert-80M-8k-retrieval',
      input: text.replace("\n", " "),
    });
    const result = response;
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
