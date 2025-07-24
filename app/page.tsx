"use client"

import { useEffect, useState } from "react"
import LoadingScreen from "@/components/loading-screen"
import GameMenu from "@/components/game-menu"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    // Preload audio file
    const audio = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%83%86%E3%83%88%E3%83%AA%E3%82%B9%20%20%E9%87%8D%E9%9F%B3%E3%83%86%E3%83%88SV%20%20Tetoris%20%28AI%20Filtered%20Instrumental%29%20%5B%20ezmp3.cc%20%5D-Cw297e6Q0rSy6snRGIDbDL6q9TIhxB.mp3",
    )

    // Preload image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sigqQurVHNjXNGBUyMl0JVn13QDLLH.png"

    // When both assets are loaded
    Promise.all([
      new Promise((resolve) => {
        img.onload = resolve
      }),
      new Promise((resolve) => {
        audio.addEventListener("canplaythrough", resolve, { once: true })
      }),
    ]).then(() => {
      setAssetsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!assetsLoaded) return

    // Simulate loading process
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Add a small delay before showing the menu
          setTimeout(() => {
            setIsLoading(false)
          }, 500)

          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [assetsLoaded])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-yellow-300">
      {isLoading ? <LoadingScreen progress={loadingProgress} /> : <GameMenu />}
    </main>
  )
}
