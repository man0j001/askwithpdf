'use client'
import React from 'react'
import {Message, useChat} from 'ai/react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageComponent } from './MessageComponent'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Props = {chatID:number}

function ChatComponent({chatID}: Props) {
    const {data} = useQuery({
      queryKey: ["chat",chatID],
      queryFn: async () =>{
        const response = await axios.post<Message[]>('/api/get-messages',{chatID})
        return response.data
      }
    })

    const {input, handleInputChange, handleSubmit, messages} = useChat({
      api: "/api/chat",
      body:{chatID},
      initialMessages: data || []
    })

    React.useEffect(() => {
      const messageContainer = document.getElementById("message-container");
      if (messageContainer) {
        messageContainer.scrollTo({
          top: messageContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [messages]);

  return (
    <section className="relative max-h-screen overflow-x-hidden overflow-y-scroll" id="message-container">
        {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

        {/* Message Box */}
        <MessageComponent messages={messages}/>

        {/* Message Input Box */}
        <form onSubmit={handleSubmit}
        className="mt-1 sticky bottom-0 inset-x-0 px-2 py-4 bg-white">
          <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            Send
          </Button>
        </div>
        </form>
        
    </section>
    
  )
}

export default ChatComponent