import axios from 'axios';

export default class SitemapApiService {
  static async getSitemap() {
    const response = await axios.get('/api/sitemap');
    return response.data;
  }
}
