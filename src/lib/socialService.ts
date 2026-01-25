import { api } from '@/lib/api';

export interface Socials {
  whatsapp: string;
  telegram: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
}

export async function fetchSocials(): Promise<Socials> {
  try {
    const response = await api.get<{ data: Socials }>('/socials');
    // Handle both wrapped {data: ...} and direct response if API varies
    if (response.data) return response.data;
    return response as unknown as Socials;
  } catch (error) {
    console.error('Fetch Socials Error:', error);
    // Return empty strings or defaults to avoid crashes
    return {
      whatsapp: '',
      telegram: '',
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: '',
      youtube: ''
    };
  }
}
