import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aqiran Xchange',
    short_name: 'Aqiran Xchange',
    description: "Gift Card Trading Service",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F5B400',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
