# AskwithPdf

Chat with PDFs. Upload a PDF, index it in Pinecone, and get grounded answers with page-level citations in a modern Next.js UI.

## Features

- PDF upload to S3 and automatic indexing in Pinecone
- Chat grounded in retrieved context (RAG)
- Citations with page buttons that scroll/highlight in the viewer
- Desktop resizable split view (PDF | Chat)
- Mobile-friendly UI

## Tech Stack

- Next.js 14 (App Router), React 18, TypeScript, Tailwind
- Pinecone (vector store), Google GenAI (text + embeddings)
- AWS S3 for file storage
- Clerk for authentication

## Prerequisites

- Node.js 18+
- AWS S3 bucket
- Pinecone account and index named `askwithpdf`
- Google API key for Generative AI (embeddings + chat)
- Clerk project (for auth)

## Environment Variables

Create `.env.local` in the project root and set (names must match code):

```
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your-bucket
NEXT_PUBLIC_AMAZON_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=...
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=...

GOOGLE_EMBEDDING_API_KEY=...

# Note: variable name used in code is PINEONE_API_KEY (intentional)
PINEONE_API_KEY=...
```

Tip: To run dev on a specific port without script changes:
- PowerShell: `$env:PORT=4000; npm run dev`
- bash/zsh: `PORT=4000 npm run dev`

## Installation

```
npm install
```

## Development

```
npm run dev
```

Open `http://localhost:3000` (or your PORT).

## Build and Run

```
npm run build
npm run start
```

## How It Works (High Level)

1. Upload a PDF via `components/FileUpload.tsx` → `/api/create-chat` uploads to S3 and indexes chunks in Pinecone.
2. Chat via `components/ChatComponent.tsx` → `/api/chat` embeds the query, retrieves context from Pinecone, and calls Google GenAI.
3. The response includes citations; `components/MessageComponent.tsx` renders buttons that navigate the PDF (`components/ui/PdfViewer.tsx`).

## Key Modules

- `lib/pinecone.ts`: PDF parsing, chunking, embeddings, upsert to Pinecone
- `lib/context.ts`: Query-to-context pipeline with structured sources for citations
- `app/api/create-chat/route.ts`: Upload flow and ingestion
- `app/api/chat/route.ts`: RAG orchestration and answer generation
- `components/ui/PdfViewer.tsx`: PDF rendering with page navigation and highlight
- `components/ChatComponent.tsx`: Chat UX and API integration

## Deployment (Vercel)

1. Add environment variables in Vercel Project Settings
2. Push to main; Vercel will build and deploy

## Troubleshooting

- Pinecone API key: ensure `PINEONE_API_KEY` matches your environment
- S3 permissions: verify IAM credentials allow `s3:PutObject` and `s3:GetObject`
- PDF worker: viewer uses the pdf.js CDN worker; confirm network access
