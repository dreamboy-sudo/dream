import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Dream } from '@prisma/client';
import { getAddress, isAddress as isAddressViem } from 'viem';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAddress = isAddressViem(params.id);
  try {
    const dreamId = isAddress ? params.id : parseInt(params.id);
  
    let dream: Dream | null = null;

    if (isAddress) {
      dream = await prisma.dream.findFirst({
        where: {
          address: getAddress(params.id),
        },
      });
    } else {
      dream = await prisma.dream.findUnique({
        where: {
          id: dreamId as number,
        },
      });
    }

    if (!dream) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: dream.id,
      prompt: dream.prompt,
      status: dream.status,
      imageUrl: dream.imageUrl,
      name: dream.name,
      ticker: dream.ticker,
      createdAt: dream.createdAt,
      address: dream.address,
    });

  } catch (error) {
    console.error('Error fetching dream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
