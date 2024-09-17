import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EnterIcon } from "@radix-ui/react-icons"
import { LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import useProfileStore from "@/stores/use-profile-store"

const Home = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { nickname, setNickname } = useProfileStore()

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/chat/${"test-room-id" || uuidv4()}`)
      setIsLoading(false)
    }, 200)
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="flex gap-4">
        <Input
          type="text"
          value={nickname}
          placeholder="Nickname"
          onChange={handleNicknameChange}
          onKeyDown={handleEnter}
        />
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? (
            <LoaderCircleIcon className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <EnterIcon className="mr-2 w-4 h-4" />
          )}
          Enter
        </Button>
      </div>
    </main>
  )
}

export default Home
