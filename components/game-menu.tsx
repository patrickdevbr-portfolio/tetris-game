"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TetorisLogo from "@/components/tetoris-logo"
import TetrisBackground from "@/components/tetris-background"
import SettingsMenu from "@/components/settings-menu"
import TetorisButton from "@/components/tetoris-button"
import TetrisGame from "@/components/tetris-game"

// Create an audio context and management outside the component
let audioContext: AudioContext | null = null
let audioSource: AudioBufferSourceNode | null = null
let gainNode: GainNode | null = null
let audioBuffer: AudioBuffer | null = null
let isPlaying = false

export default function GameMenu() {
  const [showMenu, setShowMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMusicEnabled, setIsMusicEnabled] = useState(false)
  const [musicVolume, setMusicVolume] = useState(50)
  const [playingGame, setPlayingGame] = useState(false)

  // Initialize audio context and load audio
  useEffect(() => {
    const initAudio = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        gainNode = audioContext.createGain()
        gainNode.connect(audioContext.destination)

        try {
          const response = await fetch(
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%83%86%E3%83%88%E3%83%AA%E3%82%B9%20%20%E9%87%8D%E9%9F%B3%E3%83%86%E3%83%88SV%20%20Tetoris%20%28AI%20Filtered%20Instrumental%29%20%5B%20ezmp3.cc%20%5D-Cw297e6Q0rSy6snRGIDbDL6q9TIhxB.mp3",
          )
          const arrayBuffer = await response.arrayBuffer()
          audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        } catch (error) {
          console.error("Error loading audio:", error)
        }
      }
    }

    initAudio()
    return () => {
      if (audioContext) {
        audioContext.close()
        audioContext = null
        audioBuffer = null
        isPlaying = false
      }
    }
  }, [])

  // Handle music playback
  const playMusic = useCallback(() => {
    if (!audioContext || !audioBuffer || !gainNode || isPlaying) return

    audioSource = audioContext.createBufferSource()
    audioSource.buffer = audioBuffer
    audioSource.loop = true
    audioSource.connect(gainNode)

    // Set initial volume
    gainNode.gain.value = musicVolume / 100

    audioSource.start(0)
    isPlaying = true

    // Handle when the audio ends
    audioSource.onended = () => {
      isPlaying = false
      if (isMusicEnabled) playMusic() // Restart if music is still enabled
    }
  }, [musicVolume, isMusicEnabled])

  // Handle music toggle
  const handleMusicToggle = useCallback(
    (enabled: boolean) => {
      setIsMusicEnabled(enabled)
      if (gainNode) {
        if (enabled) {
          gainNode.gain.value = musicVolume / 100
          if (!isPlaying) playMusic()
        } else {
          gainNode.gain.value = 0
        }
      }
    },
    [musicVolume, playMusic],
  )

  // Handle volume change
  const handleVolumeChange = useCallback(
    (volume: number) => {
      setMusicVolume(volume)
      if (gainNode && isMusicEnabled) {
        gainNode.gain.value = volume / 100
      }
    },
    [isMusicEnabled],
  )

  // Start music when menu shows
  useEffect(() => {
    if (showMenu && isMusicEnabled && !isPlaying) {
      playMusic()
    }
  }, [showMenu, isMusicEnabled, playMusic])

  // Show menu after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle game start
  const startGame = () => {
    setPlayingGame(true)
  }

  // Return to main menu
  const returnToMenu = () => {
    setPlayingGame(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-yellow-300">
      {/* Pixel art grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      {/* Tetris blocks falling background - only show when not playing */}
      {!playingGame && (
        <div className="absolute inset-0 overflow-hidden">
          <TetrisBackground />
        </div>
      )}

      {/* Game or Menu */}
      {playingGame ? (
        <TetrisGame onReturn={returnToMenu} />
      ) : (
        /* Menu overlay */
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: showMenu ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          {showMenu && (
            <div className="flex flex-col items-center">
              {/* TETORIS Logo */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
                className="mb-20"
              >
                <TetorisLogo />
              </motion.div>

              <div className="flex flex-col space-y-6 items-center">
                <TetorisButton onClick={startGame} label="PLAY" color="blue" />

                <TetorisButton onClick={() => setShowSettings(true)} label="SETTINGS" color="pink" />

                <TetorisButton
                  onClick={() => window.open("https://www.youtube.com/watch?v=Soy4jGPHr3g", "_blank")}
                  label="QUIT"
                  color="purple"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Settings Menu - Black background appears instantly */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <AnimatePresence>
            <SettingsMenu
              onClose={() => setShowSettings(false)}
              isMusicEnabled={isMusicEnabled}
              musicVolume={musicVolume}
              onMusicToggle={handleMusicToggle}
              onVolumeChange={handleVolumeChange}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
