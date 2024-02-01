// pages/_middleware.js
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';

export function middleware(request: NextRequest) {
    
  const { url } = request;
  if(!url.includes('static')){  
     console.log(`Request URL: ${url}`);
  }

  return NextResponse.next();
}
