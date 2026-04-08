"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type MemoryItem = {
  id: string;
  date: string; // human-friendly date
  title: string;
  excerpt: string;
  details?: string;
  tags?: string[];
};

export default function MemoryTimeline({ memories }: { memories: MemoryItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!memories || memories.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 text-center text-sm text-[rgba(255,200,225,0.7)]">
        No memories yet — start experiencing and they will appear here.
      </div>
    );
  }

  return (
    <div className="timeline-root w-full max-w-3xl mx-auto py-8">
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.04)]" />

        <ul className="space-y-8 pl-12">
          {memories.map((m, i) => (
            <li key={m.id} className="relative">
              <div className="absolute left-4 top-3 w-3 h-3 rounded-full bg-pink-400 border-2 border-[rgba(255,255,255,0.06)] shadow-sm" />

              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.42, delay: i * 0.04 }}
                className="group cursor-pointer"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="rounded-xl border px-4 py-3 bg-[linear-gradient(160deg,rgba(255,255,255,0.02),rgba(0,0,0,0.02))] border-[rgba(255,255,255,0.03)]">
                  <div className="flex items-start gap-3">
                    <div style={{ minWidth: 84 }} className="text-[0.78rem] text-pink-300 font-mono">
                      <div className="uppercase opacity-80">{m.date}</div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-[1.02rem] font-medium text-white">{m.title}</h3>
                      </div>

                      <p className="mt-1 text-[0.92rem] text-[rgba(255,200,225,0.76)]" style={{ maxWidth: '60ch' }}>
                        {m.excerpt}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(m.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="text-[0.64rem] font-mono px-2 py-1 rounded-md bg-[rgba(255,255,255,0.02)] text-[rgba(255,200,225,0.68)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === m.id && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.38 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="rounded-lg border p-4 bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.03)] text-[rgba(255,200,225,0.8)]">
                        <div>{m.details ?? m.excerpt}</div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // placeholder action — replace with open behavior
                              alert('Open memory: ' + m.title);
                            }}
                            className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white"
                          >
                            Open
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpanded(null);
                            }}
                            className="text-xs px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] text-white"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
