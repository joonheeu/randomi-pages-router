import { NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"
import { Server as NetServer } from "http"
import { Socket } from "net"

export type ResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
