'use client'
import React from 'react'
import {useChat} from 'ai/react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageComponent } from './MessageComponent'

type Props = {chatID:number}

function ChatComponent({chatID}: Props) {
    const {input, handleInputChange,handleSubmit, messages} = useChat({
      api: "/api/chat",
      body:{chatID}
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
    <section id="message-container">
        <h1>Chat Box </h1>
        {/* Message Box */}
        <MessageComponent messages={messages}/>

        {/* Message Input Box */}
        <form onSubmit={handleSubmit}>
        <Input value={input} onChange={handleInputChange} className='w-full' />
        <Button>Send</Button>
        </form>
        
    </section>
    
  )
}

export default ChatComponent