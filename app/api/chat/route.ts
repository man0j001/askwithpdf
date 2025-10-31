import { NextResponse } from 'next/server';
import { config } from 'dotenv';
import { chatTable, messages as _messages  } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { GoogleGenAI } from '@google/genai';

config({ path: '.env' });

export async function POST(req: Request) {
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

        // save user message into db
        await db.insert(_messages).values({
            chatID,
            content: lastmessage.content,
            role: "user",
          });

        const apiKey = process.env.GOOGLE_EMBEDDING_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing Google Generative AI API key" },
                { status: 500 },
            );
        }

        const generativeAI = new GoogleGenAI({ apiKey });

        const { contextText, sources } = await getContext(lastmessage.content, fileKey);

        const instruction = `You are a helpful AI assistant that strictly answers questions using the provided PDF context.
If the context does not provide the answer, respond with exactly: "I'm sorry, but I don't know the answer to that question."
When sharing facts derived from the context, mention the relevant page number in parentheses (e.g., (page 3)).`;

        const contextBlock = contextText || 'No relevant context found.';
        const userPrompt = `${instruction}

Context:
${contextBlock}

Question:
${lastmessage.content}`;

        const generation = await generativeAI.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userPrompt }],
                },
            ],
        });

        const answer = generation.text?.trim() ?? "I'm sorry, but I don't know the answer to that question.";

        await db.insert(_messages).values({
            chatID,
            content: answer,
            role: "system",
        });

        const citations = Array.from(
            new Map(
                sources.map((source) => [
                    source.pageNumber,
                    {
                        pageNumber: source.pageNumber,
                        sourceId: source.id,
                        snippet: source.text.slice(0, 200),
                    },
                ]),
            ).values(),
        );

        return NextResponse.json({
            answer,
            citations,
        });
        
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Error fetching chat completion" },
            { status: 500 }
        );
    }
}
