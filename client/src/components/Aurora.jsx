import { useEffect, useRef } from 'react'

export function Aurora({
  colorStops = ['#3B82F6', '#1E3A8A', '#0A0A0A'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 0.5,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let t = 0

    function draw() {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.5
      const cy = h * 0.42
      const r = Math.max(w, h) * (0.55 + amplitude * 0.15)

      const wobble1 = Math.sin(t * 0.7) * 0.08
      const wobble2 = Math.cos(t * 0.5) * 0.06

      const g = ctx.createRadialGradient(
        cx + w * wobble1, cy + h * wobble2, 0,
        cx, cy, r
      )

      const a0 = Math.round(blend * 255).toString(16).padStart(2, '0')
      const a1 = Math.round(blend * 0.45 * 255).toString(16).padStart(2, '0')
      const a2 = '00'

      g.addColorStop(0, colorStops[0] + a0)
      g.addColorStop(0.45, colorStops[1] + a1)
      g.addColorStop(1, (colorStops[2] || '#000000') + a2)

      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(
        cx + w * (wobble2 * 1.4), cy + h * (wobble1 * 0.8), 0,
        cx, cy, r * 0.7
      )
      const a3 = Math.round(blend * 0.3 * 255).toString(16).padStart(2, '0')
      g2.addColorStop(0, colorStops[1] + a3)
      g2.addColorStop(1, '#00000000')

      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      t += speed * 0.012
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [colorStops, amplitude, blend, speed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
