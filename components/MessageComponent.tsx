import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

type Citation = {
  pageNumber: number
  sourceId: string
  snippet?: string
}

type Message = {
  id?: string | number
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
}

type Props = {
  messages: Message[]
  onCitationClick?: (pageNumber: number) => void
  isLoading?: boolean
}

export const MessageComponent = ({ messages, onCitationClick, isLoading }: Props) => {
  if (!messages) return <></>
  return (
    <div>
      {messages.map((message, index) => {
        const key = message.id ?? `${message.role}-${index}`
        return (
          <div
            key={key}
            className={cn('flex', {
              'justify-end pl-10 my-1 ': message.role === 'user',
              'justify-start pr-10 m-1': message.role === 'assistant',
            })}
          >
            <div
              className={cn(
                'm-1 rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10 max-w-xl whitespace-pre-wrap',
                {
                  'bg-blue-600 text-white': message.role === 'user',
                },
              )}
            >
              <p>{message.content}</p>
              {message.role === 'assistant' && message.citations?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.citations.map((citation) => (
                    <Button
                      key={`${citation.sourceId}-${citation.pageNumber}`}
                      size="sm"
                      variant="outline"
                      className="bg-white text-blue-600 hover:bg-blue-50"
                      onClick={() => onCitationClick?.(citation.pageNumber)}
                      title={citation.snippet}
                    >
                      Page {citation.pageNumber}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
      {isLoading ? (
        <div className="flex justify-start pr-10 m-1">
          <div className="m-1 rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10 bg-gray-100 text-gray-600">
            Generating response...
          </div>
        </div>
      ) : null}
    </div>
  )
}