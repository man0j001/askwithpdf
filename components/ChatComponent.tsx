'use client'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageComponent } from './MessageComponent'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowUp, Loader2, MessageSquareText, Sparkles } from 'lucide-react'

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

const SUGGESTIONS = [
  'Summarize this document',
  'What are the key points?',
  'List the main conclusions',
]

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
    <section className="flex h-full flex-col overflow-hidden bg-fog">
      {/* header */}
      <header className="flex items-center gap-2.5 border-b border-dove/50 bg-pure-white/80 px-4 py-3 backdrop-blur">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-apricot-wash text-rust">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="leading-tight">
          <h3 className="text-[15px] font-medium tracking-[-0.009em] text-ink">Chat</h3>
          <p className="text-[12px] tracking-[-0.009em] text-graphite">Ask anything about your PDF</p>
        </div>
      </header>

      {/* Message Box */}
      <div id="message-container" className="steep-scroll flex-1 overflow-y-auto px-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pure-white text-rust shadow-steep-soft">
              <MessageSquareText className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h4 className="text-[18px] font-medium tracking-[-0.009em] text-ink">Start the conversation</h4>
            <p className="mt-1.5 max-w-xs text-[14px] leading-relaxed text-ash">
              Ask a question and get answers grounded in your document, with page citations you can jump to.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="cursor-pointer rounded-full border border-dove bg-pure-white px-3 py-1.5 text-[13px] text-ash transition-colors hover:border-rust/30 hover:bg-apricot-wash hover:text-rust"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <MessageComponent messages={messages} onCitationClick={onNavigateToPage} isLoading={isLoading} />
        )}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSubmit} className="bg-fog px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 rounded-2xl border border-dove bg-pure-white py-1.5 pl-3 pr-1.5 shadow-steep-soft transition-colors focus-within:border-graphite">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="h-9 w-full border-0 bg-transparent px-0 text-[15px] tracking-[-0.009em] text-ink shadow-none placeholder:text-graphite focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="ink"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            disabled={isLoading}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default ChatComponent
