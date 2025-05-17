'use client'

import { useEffect, useRef, useState } from 'react'

interface GameBoardProps {
  gameState: any
  moves: any[]
  highlight?: string | null
}

export default function GameBoard({ gameState, moves, highlight }: GameBoardProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const gameInstanceRef = useRef<any>(null)
  const [Phaser, setPhaser] = useState<any>(null)

  useEffect(() => {
    // Dynamically import Phaser only on client side
    import('phaser').then((mod) => {
      setPhaser(mod)
    })
  }, [])

  useEffect(() => {
    if (!Phaser || !gameContainerRef.current || gameInstanceRef.current) return

    const config: any = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      backgroundColor: '#ffffff',
      scene: {
        create: function(this: any) {
          // Create solid color background
          const graphics = this.add.graphics()
          graphics.fillStyle(0xf0f0f0, 1)
          graphics.fillRect(0, 0, 800, 600)

          const pointHeight = 200
          const pointWidth = 40
          const spacing = 60

          for (let i = 0; i < 12; i++) {
            graphics.fillStyle(i % 2 === 0 ? 0x333333 : 0x666666, 1)
            graphics.beginPath()
            graphics.moveTo(60 + i * spacing, 0)
            graphics.lineTo(60 + i * spacing + pointWidth / 2, pointHeight)
            graphics.lineTo(60 + i * spacing - pointWidth / 2, pointHeight)
            graphics.closePath()
            graphics.fill()

            graphics.fillStyle(i % 2 === 0 ? 0x666666 : 0x333333, 1)
            graphics.beginPath()
            graphics.moveTo(60 + i * spacing, 600)
            graphics.lineTo(60 + i * spacing + pointWidth / 2, 600 - pointHeight)
            graphics.lineTo(60 + i * spacing - pointWidth / 2, 600 - pointHeight)
            graphics.closePath()
            graphics.fill()
          }

          if (highlight) {
            const highlightGraphics = this.add.graphics()
            highlightGraphics.lineStyle(4, 0xffff00, 1)

            switch (highlight) {
              case 'board':
                highlightGraphics.strokeRect(50, 50, 700, 500)
                break
              case 'dice':
                highlightGraphics.strokeCircle(700, 300, 40)
                break
              case 'pieces':
                highlightGraphics.strokeRect(50, 50, 200, 100)
                break
              case 'home':
                highlightGraphics.strokeRect(550, 50, 200, 500)
                break
              case 'victory':
                highlightGraphics.strokeRect(750, 50, 30, 500)
                break
            }
          }
        },
        update: function(this: any) {
          // TODO: Update game state based on moves
        }
      }
    }

    gameInstanceRef.current = new Phaser.Game(config)

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true)
        gameInstanceRef.current = null
      }
    }
  }, [Phaser, highlight])

  return (
    <div
      ref={gameContainerRef}
      className="w-full h-[600px] border rounded shadow bg-white"
      aria-label="Backgammon Game Board"
    />
  )
}
