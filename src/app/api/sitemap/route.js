import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [collectionsRes, categoriesRes, blogsRes, developersRes] = await Promise.all([
      axios.get('https://api.letsmetrix.com/collection/sitemap'),
      axios.get('https://api.letsmetrix.com/category/sitemap'),
      axios.get('https://api.letsmetrix.com/blogs/sitemap'),
      axios.get('https://api.letsmetrix.com/partner/sitemap'),
    ]);

    const collections = collectionsRes.data.collection;
    const categories = categoriesRes.data.category;
    const blogs = blogsRes.data.data;
    const developers = developersRes.data.partners;

    const responseData = {
      collections,
      categories,
      blogs,
      developers,
    };

    return new NextResponse(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=2592000' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
