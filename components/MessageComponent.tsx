import React from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, FileText } from 'lucide-react'

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
    <div className="flex flex-col gap-4 py-4">
      {messages.map((message, index) => {
        const key = message.id ?? `${message.role}-${index}`
        const isUser = message.role === 'user'
        return (
          <div
            key={key}
            className={cn('flex animate-fade-up gap-2.5', {
              'justify-end pl-8': isUser,
              'justify-start pr-8': !isUser,
            })}
          >
            {/* assistant avatar badge */}
            {!isUser && (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-apricot-wash text-rust">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
            )}
            <div className="max-w-xl">
              <div
                className={cn(
                  'whitespace-pre-wrap text-[15px] leading-[1.55] tracking-[-0.009em]',
                  isUser
                    ? 'rounded-3xl rounded-tr-lg bg-ink px-4 py-2.5 text-pure-white'
                    : 'rounded-3xl rounded-tl-lg bg-pure-white px-4 py-3 text-ink shadow-steep-soft',
                )}
              >
                <p>{message.content}</p>
                {!isUser && message.citations?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-dove/40 pt-3">
                    {message.citations.map((citation) => (
                      <button
                        key={`${citation.sourceId}-${citation.pageNumber}`}
                        type="button"
                        onClick={() => onCitationClick?.(citation.pageNumber)}
                        title={citation.snippet}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dove bg-fog px-2.5 py-1 text-[13px] font-medium text-rust transition-colors hover:border-rust/30 hover:bg-apricot-wash"
                      >
                        <FileText className="h-3 w-3" strokeWidth={2} />
                        Page {citation.pageNumber}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
      {isLoading ? (
        <div className="flex animate-fade-up justify-start gap-2.5 pr-8">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-apricot-wash text-rust">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-lg bg-pure-white px-4 py-4 shadow-steep-soft">
            <span className="steep-typing-dot h-1.5 w-1.5 rounded-full bg-graphite" />
            <span className="steep-typing-dot h-1.5 w-1.5 rounded-full bg-graphite" />
            <span className="steep-typing-dot h-1.5 w-1.5 rounded-full bg-graphite" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
