import { api, type MediaItem } from './api'

const MAX_SIDE = 2000

// Shrinks a photo to at most 2000px on its longest side and re-encodes it (WebP where the
// browser can, else JPEG), so phone photos of 5-10 MB usually land at 300-600 KB.
async function compress(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const encode = (type: string, quality: number) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
  let blob = await encode('image/webp', 0.82)
  if (!blob || blob.type !== 'image/webp') blob = await encode('image/jpeg', 0.85)
  if (!blob) throw new Error('This photo could not be read')
  return { blob, width, height }
}

export async function uploadPhoto(file: File, alt = ''): Promise<MediaItem> {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not a photo`)
  const { blob, width, height } = await compress(file)
  const { media } = await api<{ media: MediaItem }>('/api/admin/media', {
    method: 'POST',
    body: blob,
    headers: {
      'Content-Type': blob.type,
      'X-Image-Width': String(width),
      'X-Image-Height': String(height),
      'X-Image-Alt': encodeURIComponent(alt.slice(0, 200)),
    },
  })
  return media
}
