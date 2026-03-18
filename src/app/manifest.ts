import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dr iTunes Consult',
    short_name: 'Dr iTunes',
    description: "Ghana's Premier Crypto & Gift Card Trading Service",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/logo/red-black.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
