import SidebarMenu from '@/components/SidebarMenu'
import PDFViewer from '@/components/ui/PdfViewer'
import { db } from '@/lib/db'
import { chatTable } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

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

  return (
    <div className="flex max-h-screen">
      <div className="flex w-full max-h-screen ">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          {/* <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} /> */}
          <SidebarMenu chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[4] border-l-4 border-l-slate-200">
          {/* <ChatComponent chatId={parseInt(chatId)} /> */}
        </div>
      </div>
    </div>
  )
}