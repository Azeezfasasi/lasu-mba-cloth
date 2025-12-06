import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/server/db/connect.js';
import {
  createCloth,
  getCloth,
  getAllClothes,
  updateCloth,
  deleteCloth,
  getFeaturedClothes,
  updateClothStock,
  getClothByName,
} from '../../server/controllers/clothController.js';

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const name = url.searchParams.get('name');
    const featured = url.searchParams.get('featured');

    // Get single cloth by ID
    if (id) {
      return new Promise((resolve, reject) => {
        const res = {
          status: (code) => ({
            json: (data) => resolve(NextResponse.json(data, { status: code })),
          }),
        };
        getCloth({ params: { id } }, res).catch(reject);
      });
    }

    // Get cloth by name
    if (name) {
      return new Promise((resolve, reject) => {
        const res = {
          status: (code) => ({
            json: (data) => resolve(NextResponse.json(data, { status: code })),
          }),
        };
        getClothByName({ params: { name } }, res).catch(reject);
      });
    }

    // Get featured cloths
    if (featured === 'true') {
      return new Promise((resolve, reject) => {
        const res = {
          status: (code) => ({
            json: (data) => resolve(NextResponse.json(data, { status: code })),
          }),
        };
        getFeaturedClothes(req, res).catch(reject);
      });
    }

    // Get all cloths with filtering and pagination
    const query = Object.fromEntries(url.searchParams);
    return new Promise((resolve, reject) => {
      const res = {
        status: (code) => ({
          json: (data) => resolve(NextResponse.json(data, { status: code })),
        }),
      };
      getAllClothes({ query }, res).catch(reject);
    });
  } catch (error) {
    console.error('Cloth API GET Error:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    return new Promise((resolve, reject) => {
      const res = {
        status: (code) => ({
          json: (data) => resolve(NextResponse.json(data, { status: code })),
        }),
      };
      // Create a mock req object with body property
      const mockReq = { body };
      createCloth(mockReq, res).catch(reject);
    });
  } catch (error) {
    console.error('Cloth API POST Error:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}

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
      updateCloth({ params: { id }, body }, res).catch(reject);
    });
  } catch (error) {
    console.error('Cloth API PUT Error:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

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
      deleteCloth({ params: { id } }, res).catch(reject);
    });
  } catch (error) {
    console.error('Cloth API DELETE Error:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}
