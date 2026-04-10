"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/hooks/useStageController"

export default function EmotionalCTA() {
  const advanceStage = useAppStore((s) => s.advanceStage)
  const markInteractionStarted = useAppStore((s) => s.markInteractionStarted)
  const reduceMotion = useReducedMotion()
  const router = useRouter()

  function handlePrimary() {
    try {
      markInteractionStarted()
      advanceStage()
    } catch (e) {
      // fallback navigation
      router.push("/landing")
    }
  }

  function handleSecondary() {
    router.push("/share")
  }

  return (
    <div className="emotional-cta" aria-live="polite">
      <motion.div
        className="emotional-cta-inner"
        aria-hidden={false}
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="cta-copy" id="cta-copy">
          <h2 className="cta-headline">Repair what's important</h2>
          <p className="cta-subline">Begin a guided apology that helps you make amends with care.</p>
        </div>

        <div className="cta-actions">
          <motion.button
            type="button"
            className="cta-primary"
            onClick={handlePrimary}
            aria-describedby="cta-copy"
            aria-label="Begin a guided apology"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={reduceMotion ? undefined : { boxShadow: "0 10px 30px rgba(247,85,144,0.18)" }}
          >
            <span>Begin a guided apology</span>
          </motion.button>

          <button type="button" className="cta-secondary" onClick={handleSecondary} aria-label="Share or preview">
            Share
          </button>
        </div>
      </motion.div>
    </div>
  )
}
