"use client"

import React, { useEffect, useRef, useState } from "react"
import { Message } from "@/types/message"
import { Typing } from "@/types/typing"
import ChatBubble from "@/components/chat-bubble"
import { format, isSameDay } from "date-fns"
import { ko } from "date-fns/locale"
import { Button } from "./ui/button"

interface ChatScrollAreaProps {
  messages: Message[]
  typing: Typing | null
  nickname: string
}

const ChatScrollArea: React.FC<ChatScrollAreaProps> = ({
  messages,
  typing,
  nickname,
}) => {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setScrollY(scrollTop)
    setIsScrolledToBottom(scrollHeight - scrollTop === clientHeight)
  }

  return (
    <div
      className="flex-grow p-4 overflow-y-auto"
      ref={chatContainerRef}
      onScroll={handleScroll}
    >
      <div className="flex flex-col gap-2">
        {messages.map((message, index) => {
          const isSameUser = message.nickname === nickname
          const isContinuous =
            messages[index - 1]?.nickname === message.nickname
          const previousMessage = messages[index - 1]
          const showDateSeparator =
            previousMessage &&
            !isSameDay(previousMessage.createdAt, message.createdAt)
          const dateSeperator = format(
            new Date(message.createdAt),
            "yyyy년 M월 d일",
            { locale: ko }
          )

          return (
            <React.Fragment key={index}>
              {showDateSeparator && (
                <div className="my-2 text-center">
                  <span className="text-gray-500 text-sm">{dateSeperator}</span>
                </div>
              )}
              <ChatBubble
                message={message}
                isSameUser={isSameUser}
                showSender={!isContinuous || showDateSeparator}
              />
            </React.Fragment>
          )
        })}
        {typing && typing.isTyping && typing.nickname !== nickname && (
          <div className="text-gray-500 text-sm">
            {typing.nickname} is typing...
          </div>
        )}
      </div>
      {!isScrolledToBottom && (
        <Button
          onClick={scrollToBottom}
          className="right-4 bottom-4 fixed bg-white shadow-md"
        >
          맨 아래로 스크롤
        </Button>
      )}
    </div>
  )
}

export default ChatScrollArea
