import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dritunesconsult.com';
  
  const routes = [
    '',
    '/about',
    '/contact',
    '/rates',
    '/rates/cards',
    '/auth/login',
    '/auth/register',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/rates' ? 'always' : 'weekly',
    priority: route === '' ? 1 : route === '/rates' ? 0.9 : 0.8,
  }));
}
