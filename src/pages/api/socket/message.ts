import { NextApiRequest as Request } from "next"
import { ResponseServerIO } from "@/types/next-response"

export default function chat(req: Request, res: ResponseServerIO) {
  if (req.method === "POST") {
    const message = req.body

    if (message.nickname === "") {
      res.status(400).json({ error: "Nickname is empty" })
      return
    }

    if (message.content === "") {
      res.status(400).json({ error: "Content is empty" })
      return
    }

    res?.socket?.server?.io?.emit("message", message)

    res.status(201).json(message)
  }
}
