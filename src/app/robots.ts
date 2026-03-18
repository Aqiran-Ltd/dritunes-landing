import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/auth/callback',
        '/newsletter/verify',
        '/newsletter/unsubscribe',
      ],
    },
    sitemap: 'https://dritunesconsult.com/sitemap.xml',
  };
}
