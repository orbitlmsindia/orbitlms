import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = join(process.cwd(), 'public', 'uploads')

        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            console.error('Error creating upload directory:', e)
        }

        const timestamp = Date.now()
        // Sanitize filename to strict alphanumeric + dot
        const sanitizedParams = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const filename = `${timestamp}-${sanitizedParams}`
        const filepath = join(uploadDir, filename)

        await writeFile(filepath, buffer)

        const fileUrl = `/uploads/${filename}`
        // Simple type detection
        let fileType = 'document'
        if (file.type === 'application/pdf') fileType = 'pdf'
        else if (file.type.includes('video')) fileType = 'video'

        return NextResponse.json({
            success: true,
            fileUrl,
            fileName: file.name,
            fileType
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
    }
}
