"use client";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    pdfName: string,
    currentChatID:number,
    chatID:number
}
function FileTabButton({pdfName, chatID, currentChatID}:Props) {
  const isActive = currentChatID === chatID;
  return (
    <div
      className={cn(
        "group my-1 flex h-11 cursor-pointer items-center gap-2.5 rounded-xl px-2.5 transition-colors",
        isActive
          ? "bg-pure-white shadow-steep-soft"
          : "bg-transparent hover:bg-pure-white/60",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          isActive
            ? "bg-apricot-wash text-rust"
            : "bg-pure-white/70 text-graphite group-hover:text-ink",
        )}
      >
        <FileText className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <span
        title={pdfName}
        className={cn(
          "w-full truncate whitespace-nowrap text-[14px] tracking-[-0.009em]",
          isActive ? "font-medium text-ink" : "text-ash",
        )}
      >
        {pdfName}
      </span>
    </div>
  )
}

export default FileTabButton;
