"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Tone = 'calm' | 'affectionate' | 'serious' | 'energetic' | 'thoughtful';

interface PersonalizationContextType {
  name: string;
  tone: Tone;
  setName: (n: string) => void;
  setTone: (t: Tone) => void;
}

const PersonalizationContext = createContext<PersonalizationContextType>({
  name: '',
  tone: 'calm',
  setName: () => {},
  setTone: () => {},
});

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [tone, setTone] = useState<Tone>('calm');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('personalization');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.name === 'string') setName(parsed.name);
      if (typeof parsed.tone === 'string') setTone(parsed.tone as Tone);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('personalization', JSON.stringify({ name, tone }));
    } catch (e) {
      // ignore
    }
  }, [name, tone]);

  return (
    <PersonalizationContext.Provider value={{ name, tone, setName, setTone }}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  return useContext(PersonalizationContext);
}

export default PersonalizationProvider;
