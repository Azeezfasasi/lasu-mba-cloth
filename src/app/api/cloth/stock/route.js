import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/server/db/connect.js';
import { updateClothStock } from '../../../server/controllers/clothController.js';

/**
 * Update cloth stock/size quantity
 * PUT /api/cloth/stock?id=clothId
 */
export async function PUT(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Cloth ID is required' },
        { status: 400 }
      );
    }

    return new Promise((resolve, reject) => {
      const res = {
        status: (code) => ({
          json: (data) => resolve(NextResponse.json(data, { status: code })),
        }),
      };
      updateClothStock({ params: { id }, body }, res).catch(reject);
    });
  } catch (error) {
    console.error('Cloth Stock API Error:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}
