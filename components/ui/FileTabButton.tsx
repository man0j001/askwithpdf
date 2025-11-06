"use client";
import { cn } from "@/lib/utils";

type Props = {
    pdfName: string,
    currentChatID:number,
    chatID:number
}
function FileTabButton({pdfName, chatID, currentChatID}:Props) {
  return (
    <div className={cn('p-1 my-2 h-10 flex',{"bg-white rounded-lg border-1 border-blue-200 drop-shadow":currentChatID === chatID, "opacity-100": currentChatID === chatID,
                    "opacity-80": currentChatID !== chatID})}>
          <div className='mr-2 flex'>
            <img src="/assets/icons/pdfIcon.svg"/>
          </div>
            <span className=' font-medium pt-1 w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{pdfName}</span>
    </div>
  )
}

export default FileTabButton;