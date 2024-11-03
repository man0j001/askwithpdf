import { NextResponse } from 'next/server';
import Together from "together-ai";
import { config } from 'dotenv';
import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { chatTable } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { Message } from 'ai';

config({ path: '.env' });

const together = new Together({
  apiKey: process.env.TOGETHER_AI,
});

const groq = createGroq({
    apiKey:process.env.GROQ
})



export async function POST(req: Request, res: Response) {
    try {
        const { messages,chatID} = await req.json();
        if (!messages.length) {
        throw new Error('No messages provided.');
        }

        const lastmessage = messages[0]
        const _chats = await db.select().from(chatTable).where(eq(chatTable.id ,chatID))

        if(_chats.length != 1){
            return NextResponse.json({error:"No Chat ID is found"},{status:404})
        }

        const fileKey = _chats[0].fileKey

        const context = getContext(lastmessage.content,fileKey)

        const prompt = {
            role: "system",
            content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            AI assistant is a big fan of Pinecone and Vercel.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            `,
          };
      

        const model = groq('llama3-8b-8192');

        const result = await streamText({
            model,
            messages:[ prompt,
                ...messages.filter((message: Message) => message.role === "user"),],
          });
        
        
        return result.toDataStreamResponse()
        
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Error fetching chat completion" },
            { status: 500 }
        );
    }


}
