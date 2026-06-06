"use client"
import React from 'react'
import FileTabButton from './ui/FileTabButton'
import FileUpload from './FileUpload'
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import { FileStack } from 'lucide-react';


type Props = {
    chats: DrizzleChat[];
    chatId: number;
    // isPro: boolean;
  };

function SidebarMenu({chats,chatId}:Props) {
  return (
    <aside className='flex h-screen max-h-screen w-72 flex-col gap-5 bg-fog px-4 py-5'>
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 px-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-pure-white">
          <FileStack className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="text-[15px] font-medium tracking-[-0.009em] text-ink">AskwithPdf</span>
      </Link>

      {/* Upload a new document */}
      <FileUpload/>

      {/* Document list */}
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="px-2 pb-1.5 text-[12px] font-medium uppercase tracking-[0.06em] text-graphite">
          Your documents
        </p>
        <nav className="steep-scroll -mr-2 flex-1 overflow-y-auto pr-1">
          {chats.length === 0 ? (
            <p className="px-2 py-2 text-[13px] tracking-[-0.009em] text-graphite">
              No documents yet — upload a PDF to begin.
            </p>
          ) : (
            chats.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <FileTabButton pdfName={chat.pdfName} chatID={chatId} currentChatID={chat.id} />
              </Link>
            ))
          )}
        </nav>
      </div>

      {/* Footer */}
      <p className="px-2 text-[12px] tracking-[-0.009em] text-dove">
        Calm reading, cited answers.
      </p>
    </aside>
  )
}

export default SidebarMenu
