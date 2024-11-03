import SidebarMenu from '@/components/SidebarMenu'
import { db } from '@/lib/db'
import { chatTable } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import { ResizeChatPdf } from '@/components/ResizeChatPdf'

type Props = {
    params:{
        chatId:string
    }
}

export default async function ChatPage({params: {chatId}}: Props) {
    const { userId }: { userId: string | null } = auth()
    if (!userId)return redirect("/sign-in");

    const _chats = await db.select().from(chatTable).where(eq(chatTable.userID ,userId))

    if(!_chats)return redirect("/");

    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect("/");
      }
    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
    console.log("Type",typeof(currentChat))

  return (
    <div className="flex max-h-screen">
      <div className="flex w-full max-h-screen ">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          {/* <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} /> */}
          <SidebarMenu chats={_chats} chatId={parseInt(chatId)} />
        </div>
        <ResizeChatPdf pdf_url={currentChat?.pdfUrl || ""} chatID = {parseInt(chatId)} />
      </div>
    </div>
  )
}