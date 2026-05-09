import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const genreId = formData.get('genreId') as string
    const duration = formData.get('duration') as string
    const mp3File = formData.get('mp3File') as File
    const pdfFile = formData.get('pdfFile') as File

    await mkdir('public/uploads/mp3', { recursive: true })
    await mkdir('public/uploads/pdf', { recursive: true })

    const mp3FileName = `${Date.now()}-${mp3File.name}`
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer())
    await writeFile(path.join(process.cwd(), 'public/uploads/mp3', mp3FileName), mp3Buffer)

    const pdfFileName = `${Date.now()}-${pdfFile.name}`
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
    await writeFile(path.join(process.cwd(), 'public/uploads/pdf', pdfFileName), pdfBuffer)

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        genreId,
        duration: duration || null,
        mp3Url: `/uploads/mp3/${mp3FileName}`,
        pdfUrl: `/uploads/pdf/${pdfFileName}`,
      }
    })

    return NextResponse.json(song, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al subir' }, { status: 500 })
  }
}

export async function GET() {
  const songs = await prisma.song.findMany({ include: { genre: true } })
  return NextResponse.json(songs)
}
