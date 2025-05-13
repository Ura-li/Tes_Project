import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    let results;

    if (query.length >= 2) {
      // 🔍 Search Failure by Name or Description (limit 3)
      results = await prisma.failure.findMany({
        where: {
          OR: [
            { Name: { contains: query } },
            { Description: { contains: query } }
          ]
        },
        take: 3,
        orderBy: { Name: 'asc' }
      });
    } else {
      // ⚙️ Default list (DOA, Returned good, Used & Consumed)
      results = await prisma.failure.findMany({
        where: {
          Name: {
            in: ['DOA', 'Returned good', 'Used & Consumed']
          }
        },
        orderBy: { Name: 'asc' }
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('🔥 Failure options error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch failure options' },
      { status: 500 }
    );
  }
}
