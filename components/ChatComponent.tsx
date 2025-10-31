'use client'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageComponent } from './MessageComponent'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Citation = {
  pageNumber: number
  sourceId: string
  snippet?: string
}

type StoredMessage = {
  id: number
  chatID: number
  content: string
  createdAt: string
  role: 'user' | 'system'
}

type ChatMessage = {
  id?: string | number
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
}

type AssistantResponse = {
  answer: string
  citations?: Citation[]
}

type Props = {
  chatID: number
  onNavigateToPage: (pageNumber: number) => void
}

function ChatComponent({ chatID, onNavigateToPage }: Props) {
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const { data } = useQuery({
    queryKey: ['chat', chatID],
    queryFn: async () => {
      const response = await axios.post<StoredMessage[]>('/api/get-messages', { chatID })
      return response.data
    },
  })

  React.useEffect(() => {
    if (data && messages.length === 0) {
      const hydratedMessages = data.map<ChatMessage>((message) => ({
        id: message.id,
        role: message.role === 'system' ? 'assistant' : 'user',
        content: message.content,
      }))
      setMessages(hydratedMessages)
    }
  }, [data, messages.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const timestamp = Date.now()
    const userMessage: ChatMessage = {
      id: `user-${timestamp}`,
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
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
          chatID,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const payload = (await response.json()) as AssistantResponse
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: payload.answer,
        citations: payload.citations ?? [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, something went wrong while generating a response.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    const messageContainer = document.getElementById('message-container')
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <section className="flex h-full flex-col overflow-hidden">
      {/* header */}
      <div className="p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Message Box */}
      <div id="message-container" className="flex-1 overflow-y-auto px-2">
        <MessageComponent messages={messages} onCitationClick={onNavigateToPage} isLoading={isLoading} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSubmit} className="mt-1 px-2 py-4 bg-white border-t">
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
            disabled={isLoading}
          />
          <Button className="bg-blue-600 ml-2" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ChatComponent