import { Message } from 'ai/react'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
    messages:Message [];
}

export const MessageComponent = ({messages}: Props) => {
    if(!messages)return <></>
  return (
    <div>
      {messages.map((message)=>{
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10 my-1 ": message.role === "user",
              "justify-start pr-10 m-1": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "m-1 rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": message.role === "user",
                }
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}