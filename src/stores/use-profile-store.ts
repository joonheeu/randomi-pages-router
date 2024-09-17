import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface ProfileStore {
  nickname: string
  setNickname: (nickname: string) => void
}

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      nickname: "",
      setNickname: (nickname: string) => set({ nickname }),
    }),
    {
      name: "profile",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useProfileStore
