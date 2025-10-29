'use client'
import React from 'react'
import { CoreMessage } from 'ai'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageComponent } from './MessageComponent'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Props = {chatID:number}

function ChatComponent({chatID}: Props) {
    const [input, setInput] = React.useState('')
    const [messages, setMessages] = React.useState<CoreMessage[]>([])
    const [isLoading, setIsLoading] = React.useState(false)

    const {data} = useQuery({
      queryKey: ["chat",chatID],
      queryFn: async () =>{
        const response = await axios.post<CoreMessage[]>('/api/get-messages',{chatID})
        return response.data
      }
    })

    React.useEffect(() => {
      if (data) {
        setMessages(data)
      }
    }, [data])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      const userMessage: CoreMessage = {
        role: 'user',
        content: input,
      }

      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [userMessage],
            chatID
          }),
        })

        if (!response.ok) throw new Error('Failed to get response')

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            assistantMessage += chunk
            
            setMessages(prev => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = assistantMessage
              } else {
                newMessages.push({
                  role: 'assistant',
                  content: assistantMessage,
                })
              }
              return newMessages
            })
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

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