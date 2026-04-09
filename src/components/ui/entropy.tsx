import { useEffect, useRef, useCallback } from 'react'

export function Entropy() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollProgressRef = useRef(0)

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
      velocity: { x: number; y: number }
      originalX: number
      originalY: number
      neighbors: Particle[]

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.originalX = x
        this.originalY = y
        this.pSize = 1
        this.velocity = {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        }
        this.neighbors = []
      }

      update() {
        const sp = scrollProgressRef.current
        const chaos = 1 - sp

        const dx = this.originalX - this.x
        const dy = this.originalY - this.y

        // Chaos: random drift
        this.velocity.x += (Math.random() - 0.5) * 1.5 * chaos
        this.velocity.y += (Math.random() - 0.5) * 1.5 * chaos
        this.velocity.x *= 0.95
        this.velocity.y *= 0.95

        // Blend: grid-return (order) vs random drift (chaos)
        this.x += dx * 0.12 * sp + this.velocity.x * 3 * chaos
        this.y += dy * 0.12 * sp + this.velocity.y * 3 * chaos

        // Boundary checks
        if (this.x < 0 || this.x > w) this.velocity.x *= -1
        if (this.y < 0 || this.y > h) this.velocity.y *= -1
        this.x = Math.max(0, Math.min(w, this.x))
        this.y = Math.max(0, Math.min(h, this.y))
      }

      draw(ctx: CanvasRenderingContext2D) {
        const sp = scrollProgressRef.current
        const alpha = 0.06 + sp * 0.04
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
        particles.push(new Particle(x, y))
      }
    }

    function updateNeighbors() {
      particles.forEach(particle => {
        particle.neighbors = particles.filter(other => {
          if (other === particle) return false
          return Math.hypot(particle.x - other.x, particle.y - other.y) < 60
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
          if (distance < 30) {
            const alpha = 0.03 * (1 - distance / 30)
            ctx.strokeStyle = `${particleColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(neighbor.x, neighbor.y)
            ctx.stroke()
          }
        })
      })

      time++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  useEffect(() => {
    const cleanup = init()

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollProgressRef.current = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0
    }

    const handleResize = () => {
      cleanup?.()
      init()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    handleScroll()

    return () => {
      cleanup?.()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [init])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'hsl(var(--background))' }}>
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
