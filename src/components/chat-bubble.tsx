import { Message } from "@/types/message"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const ChatBubble = (props: {
  message: Message
  isSameUser: boolean
  showSender: boolean
}) => {
  const { message, isSameUser, showSender } = props

  const formattedTime = message.createdAt
    ? format(new Date(message.createdAt), "HH:mm")
    : "시간 정보 없음"

  return (
    <div
      className={cn("flex flex-col", isSameUser ? "items-end" : "items-start")}
    >
      {showSender && (
        <span className="text-gray-500 text-sm">{message.nickname}</span>
      )}
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex flex-col px-4 py-2 rounded-md w-fit max-w-[300px]",
                isSameUser ? "bg-blue-500" : "bg-gray-700"
              )}
            >
              <p>{message.content}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side={isSameUser ? "left" : "right"}
            className="bg-transparent"
          >
            <p className="text-muted-foreground text-sm">{formattedTime}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default ChatBubble
