import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  let envContentMasked = '';
  
  if (envExists) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    envContentMasked = lines.map(line => {
      const [key, value] = line.split('=');
      if (!key) return '';
      return `${key}=${value ? value.substring(0, 5) + '...' : 'MISSING'}`;
    }).join('\n');
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    envExists,
    envPath,
    groqKeyEnv: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'MISSING',
    envContentMasked
  });
}
