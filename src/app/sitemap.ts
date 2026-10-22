import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aqiranxchange.com';
  
  const routes: { path: string; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/rates', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/trade', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/cookies', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/auth/login', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/auth/register', changeFrequency: 'monthly', priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
