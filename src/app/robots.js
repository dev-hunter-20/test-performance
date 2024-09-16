import { DOMAIN } from '@/constants/ApiUrl';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: '/search',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/'],
        disallow: '/search',
      },
      {
        userAgent: 'bingbot',
        disallow: '/search',
      },
      {
        userAgent: 'AppleBot',
        disallow: '/search',
        crawlDelay: 2,
      },
    ],
    sitemap: `${DOMAIN}sitemap.xml`,
  };
}
