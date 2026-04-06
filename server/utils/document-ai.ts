import type { ExtractedText } from '../../app/types'

import process from 'node:process'

import { DocumentProcessorServiceClient } from '@google-cloud/documentai'

let client: DocumentProcessorServiceClient | null = null

function getClient(): DocumentProcessorServiceClient {
  if (!client) {
    client = new DocumentProcessorServiceClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    })
  }
  return client
}

function getProcessorName(): string {
  const project = process.env.GOOGLE_PROJECT_ID
  const location = process.env.GOOGLE_LOCATION
  const processor = process.env.GOOGLE_PROCESSOR_ID

  if (!project || !location || !processor) {
    throw new Error('Missing Google Document AI environment variables')
  }

  return `projects/${project}/locations/${location}/processors/${processor}`
}

export async function processImage(imageBase64: string, mimeType: string): Promise<ExtractedText[]> {
  const docClient = getClient()
  const name = getProcessorName()

  const [result] = await docClient.processDocument({
    name,
    rawDocument: { content: imageBase64, mimeType },
  })

  const document = result.document
  if (!document?.text)
    return []

  const fullText = document.text
  const texts: ExtractedText[] = []

  for (const page of document.pages ?? []) {
    const language = page.detectedLanguages?.[0]?.languageCode ?? null

    for (const block of page.blocks ?? []) {
      const content = extractTextFromLayout(block.layout as Parameters<typeof extractTextFromLayout>[0], fullText)
      if (!content.trim())
        continue

      texts.push({
        id: crypto.randomUUID(),
        content: content.trim(),
        confidence: block.layout?.confidence ?? 0,
        boundingBox: normalizeBoundingPoly(block.layout?.boundingPoly),
        language,
      })
    }
  }

  return texts
}

function extractTextFromLayout(
  layout: { textAnchor?: { textSegments?: { startIndex?: unknown, endIndex?: unknown }[] | null } | null } | null | undefined,
  fullText: string,
): string {
  const segments = layout?.textAnchor?.textSegments ?? []
  return segments
    .map(s => fullText.slice(Number(s.startIndex ?? 0), Number(s.endIndex ?? 0)))
    .join('')
}

function normalizeBoundingPoly(
  poly: { normalizedVertices?: { x?: number | null, y?: number | null }[] | null } | null | undefined,
): ExtractedText['boundingBox'] {
  const vertices = poly?.normalizedVertices ?? []

  if (vertices.length < 4) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  const xs = vertices.map(v => v.x ?? 0)
  const ys = vertices.map(v => v.y ?? 0)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)

  return {
    x: minX,
    y: minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
  }
}
