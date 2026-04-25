import type { MetadataRoute } from 'next';
import { EXPERIENCE_CATALOG } from '@/lib/experienceCatalog';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yor-smriti.vercel.app';
const BASE_URL = BASE.replace(/\/$/, '');

const STATIC_ROUTES = ['/', '/message', '/hub', '/reply'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = Array.from(new Set([
    ...STATIC_ROUTES,
    ...EXPERIENCE_CATALOG.map((experience) => experience.href),
  ]));

  return routes.map((route) => ({
    url: route === '/' ? BASE_URL : `${BASE_URL}${route}`,
    lastModified: now,
    priority: route === '/' ? 1.0 : route === '/message' ? 0.9 : 0.8,
    changeFrequency: 'monthly',
  }));
}
