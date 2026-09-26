import { useRef, type PointerEvent, type ReactNode } from 'react'

interface TiltCardProps {
  className?: string
  children: ReactNode
  maxTilt?: number
}

/**
 * Wraps children in a card that tilts in 3D toward the cursor, like a
 * physical object catching the light. Pure CSS transform via a ref —
 * no state/re-renders on pointer move, so it stays smooth.
 */
export default function TiltCard({ className = '', children, maxTilt = 14 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || event.pointerType === 'touch') return

    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 2 * maxTilt
    const rotateX = (0.5 - y) * 2 * maxTilt

    el.style.transition = 'transform 100ms ease-out'
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
  }

  const handlePointerLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`[transform-style:preserve-3d] will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
