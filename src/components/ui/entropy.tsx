import { useEffect, useRef, useCallback } from 'react'

export function Entropy() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const particleColor = '#ffffff'

    class Particle {
      x: number
      y: number
      pSize: number
      order: boolean
      velocity: { x: number; y: number }
      originalX: number
      originalY: number
      influence: number
      neighbors: Particle[]

      constructor(x: number, y: number, order: boolean) {
        this.x = x
        this.y = y
        this.originalX = x
        this.originalY = y
        this.pSize = 2
        this.order = order
        this.velocity = {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        }
        this.influence = 0
        this.neighbors = []
      }

      update() {
        if (this.order) {
          const dx = this.originalX - this.x
          const dy = this.originalY - this.y
          const chaosInfluence = { x: 0, y: 0 }
          this.neighbors.forEach(neighbor => {
            if (!neighbor.order) {
              const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y)
              const strength = Math.max(0, 1 - distance / 100)
              chaosInfluence.x += neighbor.velocity.x * strength
              chaosInfluence.y += neighbor.velocity.y * strength
              this.influence = Math.max(this.influence, strength)
            }
          })
          this.x += dx * 0.05 * (1 - this.influence) + chaosInfluence.x * this.influence
          this.y += dy * 0.05 * (1 - this.influence) + chaosInfluence.y * this.influence
          this.influence *= 0.99
        } else {
          this.velocity.x += (Math.random() - 0.5) * 0.5
          this.velocity.y += (Math.random() - 0.5) * 0.5
          this.velocity.x *= 0.95
          this.velocity.y *= 0.95
          this.x += this.velocity.x
          this.y += this.velocity.y
          // Constrain chaos to right half
          if (this.x < w / 2 || this.x > w) this.velocity.x *= -1
          if (this.y < 0 || this.y > h) this.velocity.y *= -1
          this.x = Math.max(w / 2, Math.min(w, this.x))
          this.y = Math.max(0, Math.min(h, this.y))
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.order ? 0.5 - this.influence * 0.3 : 0.55
        ctx.fillStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.pSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    const gridSize = Math.round(Math.sqrt(w * h) / 25)
    const cols = Math.ceil(w / (w / gridSize))
    const rows = Math.ceil(h / (h / gridSize))
    const spacingX = w / cols
    const spacingY = h / rows

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = spacingX * i + spacingX / 2
        const y = spacingY * j + spacingY / 2
        // Left half = order, right half = chaos
        const order = x < w / 2
        particles.push(new Particle(x, y, order))
      }
    }

    function updateNeighbors() {
      particles.forEach(particle => {
        particle.neighbors = particles.filter(other => {
          if (other === particle) return false
          return Math.hypot(particle.x - other.x, particle.y - other.y) < 100
        })
      })
    }

    let time = 0
    let animationId: number

    function animate() {
      ctx.clearRect(0, 0, w, h)

      if (time % 30 === 0) updateNeighbors()

      particles.forEach(particle => {
        particle.update()
        particle.draw(ctx)

        particle.neighbors.forEach(neighbor => {
          const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y)
          if (distance < 50) {
            const alpha = 0.18 * (1 - distance / 50)
            ctx.strokeStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(neighbor.x, neighbor.y)
            ctx.stroke()
          }
        })
      })

      // Subtle vertical divider at center
      ctx.strokeStyle = `${particleColor}26`
      ctx.lineWidth = 0.5
      ctx.setLineDash([4, 8])
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2, h)
      ctx.stroke()
      ctx.setLineDash([])

      time++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  useEffect(() => {
    const cleanup = init()

    const handleResize = () => {
      cleanup?.()
      init()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cleanup?.()
      window.removeEventListener('resize', handleResize)
    }
  }, [init])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'hsl(var(--background))' }}>
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
