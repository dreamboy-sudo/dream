'server-only';

import { NewsResponse } from "@/lib/types";
import { NextResponse } from "next/server";

interface MinimumNewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  }
}


 async function getMemeNews(): Promise<NewsResponse> {

  const q = 'meme'
  const from = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0] // 7 days ago
  try {
    const response = await fetch(
            `https://newsapi.org/v2/everything?q=${q}&from=${from}&sortBy=publishedAt`, 
            {
        headers: {
          'Authorization': `Bearer ${process.env.NEWS_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      status: 'success',
      totalResults: data.totalResults,
      articles: data.articles.map((article: MinimumNewsArticle) => ({
        title: article.title,
        description: article.description || '',
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name,
          url: '', // NewsAPI doesn't provide source URLs
        },
        category: 'meme',
      })).filter((a: MinimumNewsArticle) => a.title !== "[Removed]")
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const news = await getMemeNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error in /api/dreamy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}