"use client"

import React, { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { StageId } from '@/types'

interface DynamicBackgroundProps {
  stage: StageId
}

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  vx: number
  vy: number
  color: string
  layer: number
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function DynamicBackground({ stage }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const lastRef = useRef<number>(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext('2d', { alpha: true })
    if (!context) return
    const safeCanvas = canvasEl as HTMLCanvasElement
    const safeContext = context as CanvasRenderingContext2D

    let running = true
    const dpr = Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)

    function resize() {
      const w = Math.max(1, Math.floor(window.innerWidth * dpr))
      const h = Math.max(1, Math.floor(window.innerHeight * dpr))
      if (safeCanvas.width !== w || safeCanvas.height !== h) {
        safeCanvas.width = w
        safeCanvas.height = h
        safeCanvas.style.width = `${window.innerWidth}px`
        safeCanvas.style.height = `${window.innerHeight}px`
        safeContext.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
    }

    function initParticles() {
      const w = window.innerWidth
      const h = window.innerHeight
      const parts: Particle[] = []

      for (let i = 0; i < 40; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: rand(0.6, 2.4),
          speed: rand(6, 30),
          vx: rand(-0.02, 0.02),
          vy: rand(0.02, 0.12),
          color: 'rgba(255,255,255,0.9)',
          layer: 0,
        })
      }

      for (let i = 0; i < 12; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: rand(30, 120),
          speed: rand(7, 20),
          vx: rand(-0.015, 0.015),
          vy: rand(-0.015, 0.015),
          color: `rgba(247,85,144,${rand(0.06, 0.14)})`,
          layer: 1,
        })
      }

      for (let i = 0; i < 6; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: rand(120, 300),
          speed: rand(1, 8),
          vx: rand(-0.01, 0.01),
          vy: rand(-0.006, 0.006),
          color: `rgba(255,179,207,${rand(0.04, 0.09)})`,
          layer: 2,
        })
      }

      particlesRef.current = parts
    }

    function drawBase() {
      const w = safeCanvas.width / dpr
      const h = safeCanvas.height / dpr
      const cs = getComputedStyle(document.documentElement)
      const top = cs.getPropertyValue('--panda-pink-50') || '#fff0f5'
      const mid = cs.getPropertyValue('--panda-cream') || '#fdf8f0'
      const bottom = cs.getPropertyValue('--panda-pink-200') || '#ffb3cf'
      const g = safeContext.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, top.trim())
      g.addColorStop(0.5, mid.trim())
      g.addColorStop(1, bottom.trim())
      safeContext.fillStyle = g
      safeContext.fillRect(0, 0, w, h)
    }

    function animate(now: number) {
      if (!running) return
      const dt = Math.min(40, now - (lastRef.current || now)) / 16.666
      lastRef.current = now

      if (!reduced) {
        drawBase()
        safeContext.globalCompositeOperation = 'lighter'
        const w = safeCanvas.width / dpr
        const h = safeCanvas.height / dpr
        for (const p of particlesRef.current) {
          p.x += p.vx * p.speed * dt
          p.y += p.vy * p.speed * dt
          if (p.x < -p.size) p.x = w + p.size
          if (p.x > w + p.size) p.x = -p.size
          if (p.y < -p.size) p.y = h + p.size
          if (p.y > h + p.size) p.y = -p.size

          const rad = p.size
          const grad = safeContext.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad)
          grad.addColorStop(0, p.color)
          grad.addColorStop(1, 'rgba(0,0,0,0)')
          safeContext.fillStyle = grad
          safeContext.beginPath()
          safeContext.arc(p.x, p.y, rad, 0, Math.PI * 2)
          safeContext.fill()
        }
        safeContext.globalCompositeOperation = 'source-over'
      } else {
        drawBase()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    function onResize() {
      resize()
      initParticles()
    }

    resize()
    initParticles()
    rafRef.current = requestAnimationFrame(animate)

    const handleVisibility = () => {
      if (document.hidden) {
        running = false
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      } else {
        if (!running) {
          running = true
          lastRef.current = performance.now()
          rafRef.current = requestAnimationFrame(animate)
        }
      }
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [stage, reduced])

  return <canvas ref={canvasRef} className="dynamic-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
}
