import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  
  if (!slug) {
    return NextResponse.json({ exists: false })
  }
  
  const imagePath = path.join(process.cwd(), 'IMAGE', `${slug}.jpg`)
  const imagePathPng = path.join(process.cwd(), 'IMAGE', `${slug}.png`)
  
  const exists = fs.existsSync(imagePath) || fs.existsSync(imagePathPng)
  
  return NextResponse.json({ exists })
}
