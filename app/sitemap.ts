/**
 * Sitemap — Bug 56 fix (extends Bug 47 fix).
 *
 * Bug 47 removed the full EXPERIENCE_CATALOG enumeration from the sitemap,
 * leaving only the root URL. Bug 56 closes the remaining gap:
 *
 * THE PROBLEM
 * -----------
 * Even a single-entry sitemap listing BASE_URL is publicly readable at
 * /sitemap.xml. For a fully private site every URL returned here becomes
 * discoverable before a visitor has authenticated. robots.txt with
 * `Disallow: /` only hints to well-behaved crawlers — the sitemap XML
 * itself is served unconditionally to anyone who requests it.
 *
 * This site has zero public-facing content. The root route immediately
 * redirects unauthenticated visitors, so indexing it provides no value
 * and leaks the existence and domain of every private page.
 *
 * THE FIX
 * -------
 * Return an empty URL set. Next.js will render a valid but empty
 * <urlset> document — structurally correct XML that exposes nothing.
 *
 * IF YOU ADD PUBLIC PAGES LATER
 * ------------------------------
 * Add only genuinely public, unauthenticated routes here. Never list
 * /hub, /message, /reply, /letter, or any experience path — those are
 * private by design and must stay out of all public sitemaps.
 */
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
