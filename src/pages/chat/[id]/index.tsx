import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Message } from "@/types/message"
import useProfileStore from "@/stores/use-profile-store"
import { useRouter } from "next/router"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import { io, Socket } from "socket.io-client"
import { useEffect, useState, useRef } from "react"
import ChatScrollArea from "@/components/chat-scroll-area"
import { LoaderCircleIcon } from "lucide-react"
import { Typing } from "@/types/typing"
import { ThemeButton } from "@/components/theme-button"

const Chat = () => {
  const router = useRouter()
  const { id: roomId } = router.query

  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState<string>("")
  const { nickname } = useProfileStore()
  const socketRef = useRef<Socket | null>(null)
  const [typing, setTyping] = useState<Typing | null>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    if (nickname === "") {
      router.push("/")
    }

    fetch("/api/socket/connect")
    const socket = io({
      upgrade: false,
      query: {
        roomId,
      },
    })
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Connected to server")
    })

    socket.on("messages", (messages: Message[]) => {
      setMessages(messages)
    })

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socket.on("typing", (recivedTyping: Typing) => {
      setTyping(recivedTyping)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isTyping && content.length > 0) {
      setIsTyping(true)
      socketRef.current?.emit("typing", { nickname, isTyping: true })
    } else if (content.length === 0) {
      setIsTyping(false)
      socketRef.current?.emit("typing", { nickname, isTyping: false })
    }
  }, [content])

  const sendMessage = async (message: Message) => {
    if (content === "") {
      return
    }

    setIsLoading(true)
    const response = await fetch("/api/socket/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
    setIsLoading(false)
    inputRef.current?.click()

    if (response.ok) {
      setContent("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage({ nickname, content, createdAt: new Date() })
    }
  }

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === "compositionend") {
      e.preventDefault()
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between px-2 py-4 container">
        <h2 className="font-bold text-2xl">{/* {roomId} */}</h2>
        <ThemeButton />
      </header>
      <ChatScrollArea messages={messages} typing={typing} nickname={nickname} />
      <div className="flex gap-2 p-4">
        <Input
          ref={inputRef}
          type="text"
          value={content}
          disabled={isLoading}
          placeholder="Type your message..."
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
        />
        <Button
          disabled={isLoading}
          onClick={() =>
            sendMessage({ nickname, content, createdAt: new Date() })
          }
        >
          {isLoading ? (
            <LoaderCircleIcon className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <PaperPlaneTilt weight="fill" className="mr-2 w-4 h-4" />
          )}
          Send
        </Button>
      </div>
    </div>
  )
}

export default Chat
