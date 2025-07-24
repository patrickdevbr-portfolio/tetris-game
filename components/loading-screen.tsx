"use client"

import { useEffect, useRef } from "react"

interface LoadingScreenProps {
  progress: number
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    // Create and load the image
    if (!imageRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sigqQurVHNjXNGBUyMl0JVn13QDLLH.png"
      img.onload = () => {
        imageRef.current = img
        drawLoadingAnimation()
      }
    } else {
      drawLoadingAnimation()
    }

    function drawLoadingAnimation() {
      const canvas = canvasRef.current
      if (!canvas || !imageRef.current) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const img = imageRef.current

      // Calculate the size to maintain aspect ratio
      const size = Math.min(canvas.width, canvas.height) * 0.8
      const aspectRatio = img.width / img.height
      const width = aspectRatio >= 1 ? size : size * aspectRatio
      const height = aspectRatio >= 1 ? size / aspectRatio : size

      // Center the image
      const x = (canvas.width - width) / 2
      const y = (canvas.height - height) / 2

      // Draw the original image (grayscale version)
      ctx.drawImage(img, x, y, width, height)

      // Apply grayscale filter to the entire image
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) {
          // If pixel is not transparent
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg // Red
          data[i + 1] = avg // Green
          data[i + 2] = avg // Blue
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Now draw the colored version with a wave-like mask based on loading progress
      ctx.save()

      // Create a clipping region for the wave effect
      ctx.beginPath()

      const waveHeight = 10 // Height of the wave
      const waveCount = 5 // Number of wave cycles

      const fillHeight = canvas.height - (canvas.height * progress) / 100

      ctx.moveTo(0, canvas.height)

      // Create wavy top edge
      for (let i = 0; i <= canvas.width; i++) {
        const waveY = fillHeight + Math.sin((i / canvas.width) * Math.PI * 2 * waveCount) * waveHeight
        ctx.lineTo(i, waveY)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.clip()

      // Draw the colored version
      ctx.drawImage(img, x, y, width, height)

      ctx.restore()

      // Draw pixel art border
      ctx.strokeStyle = "black"
      ctx.lineWidth = 4
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      // Draw pixel corners
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, 8, 8)
      ctx.fillRect(canvas.width - 8, 0, 8, 8)
      ctx.fillRect(0, canvas.height - 8, 8, 8)
      ctx.fillRect(canvas.width - 8, canvas.height - 8, 8, 8)
    }
  }, [progress])

  return (
    <div className="flex flex-col items-center justify-center bg-yellow-300 min-h-screen w-full">
      <div className="relative">
        <canvas ref={canvasRef} width={300} height={300} className="border-4 border-black shadow-lg" />
      </div>

      <div className="mt-8 text-center">
        <div
          className="text-3xl font-bold text-gray-800"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.5rem" }}
        >
          Loading...
        </div>
        <div
          className="mt-2 text-2xl font-semibold text-gray-800"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.2rem" }}
        >
          {progress}%
        </div>
      </div>

      {/* Artist credit */}
      <div className="mt-4 text-center">
        <a
          href="https://medibang.com/u/2strawberry4you/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 text-sm hover:text-blue-700 hover:underline transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.6rem" }}
        >
          Art by 2strawberry4you
        </a>
      </div>
    </div>
  )
}
