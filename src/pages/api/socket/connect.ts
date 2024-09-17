import { NextApiRequest as Request } from "next"
import { Server as SocketIOServer } from "socket.io"
import { Message } from "@/types/message"
import { ResponseServerIO } from "@/types/next-response"
import { Typing } from "@/types/typing"

let messages: Message[] = []

export default function SocketHandler(req: Request, res: ResponseServerIO) {
  if (res.socket.server.io) {
    console.log("Already set up")
    res.end()
    return
  }

  const io = new SocketIOServer(res.socket.server)
  res.socket.server.io = io

  io.on("connection", (socket) => {
    const roomId = socket.handshake.query.roomId as string
    console.log(`${socket.id} connected to room ${roomId}`)

    socket.join(roomId)
    socket.to(roomId).emit("messages", messages)

    socket.on("message", (message) => {
      const isExist = messages.find(
        (_message) => _message.nickname === message.nickname
      )
      if (isExist === undefined) {
        messages.push(message)
      }
    })

    socket.on("typing", (typingUsername: Typing) => {
      socket.to(roomId).emit("typing", typingUsername)
    })

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected from room ${roomId}`)
    })
  })

  console.log("Setting up socket")
  res.end()
}
