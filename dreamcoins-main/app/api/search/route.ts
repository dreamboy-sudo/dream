import { prisma } from '@/lib/prisma';
import { DreamStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress, getAddress } from 'viem';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = parseInt(searchParams.get('cursor') || '0');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // If the query is an Ethereum address, search by exact address
    if (isAddress(query)) {
      const formattedAddress = getAddress(query);
      const dream = await prisma.dream.findFirst({
        where: { address: formattedAddress, status: DreamStatus.COMPLETED },
      });

      return NextResponse.json({
        data: dream ? [dream] : [],
        nextCursor: null,
        hasMore: false,
      });
    }

    // Updated search with ranking
    const dreams = await prisma.dream.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ticker: { contains: query, mode: 'insensitive' } },
          { prompt: { contains: query, mode: 'insensitive' } },
        ],
        address: { not: null },
        imageUrl: { not: null },
        status: DreamStatus.COMPLETED
      },
      orderBy: [
         {
          name: 'asc',
        },
        {
          ticker: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
      take: limit + 1,
      skip: cursor,
    });

    const hasMore = dreams.length > limit;
    const data = hasMore ? dreams.slice(0, -1) : dreams;
    const nextCursor = hasMore ? cursor + limit : null;

    return NextResponse.json({
      data,
      nextCursor,
      hasMore,
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
