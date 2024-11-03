
import Together from "together-ai";
import { config } from 'dotenv';
// import Groq from "groq-sdk";



const together = new Together({
  apiKey: process.env.TOGETHER_AI,
});

// const groqClient = new Groq({
//   apiKey: process.env.GROQ, // Use your Groq API key
// });

// meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo
export async function getEmbeddings(text: string) {
  try {
    const response = await together.embeddings.create({
      model: 'togethercomputer/m2-bert-80M-2k-retrieval',
      input: text.replace("\n", " "),
    });
    // const response = await groqClient.embeddings.create({
    //   model: 'llama3-8b-8192', 
    //   input: text.replace("\n", " "),
    // });

    const result = response;
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
