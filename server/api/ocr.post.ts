import { Buffer } from 'node:buffer'
import { processImage } from '../utils/document-ai'

export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const file = form.get('image') as File | null

  if (!file) {
    throw createError({ statusCode: 400, message: 'No image provided' })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff']
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, message: `Unsupported image type: ${file.type}` })
  }

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  try {
    const texts = await processImage(base64, file.type)
    return { texts }
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'OCR processing failed'
    throw createError({ statusCode: 500, message })
  }
})
