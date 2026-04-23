import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yor-smriti.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE,              lastModified: now, priority: 1.0, changeFrequency: 'monthly' },
    { url: `${BASE}/message`, lastModified: now, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/letter`,  lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/panda`,   lastModified: now, priority: 0.9, changeFrequency: 'monthly' },
  ];
}
