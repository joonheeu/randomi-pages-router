import { useState, useRef, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function ThemeButton() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsOpen(true)
    }, 500)
  }

  const handlePressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    if (!isOpen) {
      setTheme(theme === "dark" ? "light" : "dark")
    }
  }

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="icon"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className="relative overflow-hidden"
        aria-label="테마 전환"
      >
        <Sun className="opacity-100 dark:opacity-0 w-5 h-5 text-black transition-all translate-y-0 dark:translate-y-[200%] scale-100 dark:scale-0" />
        <Moon className="absolute opacity-0 dark:opacity-100 w-5 h-5 text-white transition-all translate-y-[200%] dark:translate-y-0 scale-0 dark:scale-100" />
        {isMounted && <PopoverTrigger className="-z-10 absolute inset-0" />}
      </Button>
      <PopoverContent className="w-40">
        <div className="flex flex-col space-y-1">
          <Button variant="ghost" onClick={() => handleThemeChange("light")}>
            라이트
          </Button>
          <Button variant="ghost" onClick={() => handleThemeChange("dark")}>
            다크
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
