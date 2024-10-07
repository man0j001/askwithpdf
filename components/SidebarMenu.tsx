"use client"
import React from 'react'
import FileTabButton from './ui/FileTabButton'
import FileUpload from './FileUpload'
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';


type Props = {
    chats: DrizzleChat[];
    chatId: number;
    // isPro: boolean;
  };

function SidebarMenu({chats,chatId}:Props) {
  return (
    <aside className='bg-main h-screen px-4 w-full max-h-screen soff p-4'>
      <div>
        <h2>Chat with PDF </h2>
        <FileUpload/>
        <hr></hr>
        {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
                <FileTabButton pdfName={chat.pdfName} chatId={chatId} currentChatId={chat.id}  />
            </Link>
        ))} 
      </div>
    </aside>
  )
}

export default SidebarMenu