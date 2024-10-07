"use client";
import { cn } from "@/lib/utils";

type Props = {
    pdfName: string,
    currentChatId:Number,
    chatId:Number
}
function FileTabButton({pdfName, chatId, currentChatId}:Props) {
  return (
    <div className={cn('p-1 my-2 h-10 flex',{"bg-white rounded-lg border-1 border-blue-200 drop-shadow":currentChatId === chatId, "opacity-100": currentChatId === chatId,
                    "opacity-80": currentChatId !== chatId})}>
          <div className='mr-2 flex'>
            <img src="/assets/icons/pdfIcon.svg"/>
          </div>
            <span className=' font-medium pt-1 w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{pdfName}</span>
    </div>
  )
}

export default FileTabButton;