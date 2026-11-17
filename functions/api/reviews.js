function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
}

export async function onRequestGet(context) {
  const apiKey = context.env.GOOGLE_PLACES_API_KEY
  const placeId = context.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return json({ error: 'GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID not configured' }, { status: 501 })
  }

  // Google bills each call, so keep one answer for 12 hours at this data centre.
  const cache = caches.default
  const cacheKey = new Request(new URL('/api/reviews?v=1', context.request.url).toString())
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return json(
        {
          error: 'Failed to fetch reviews',
          details: data,
        },
        { status: response.status }
      )
    }

    const reviews = (data.reviews || []).map((review, index) => {
      const name = review?.authorAttribution?.displayName || 'Google User'
      const text = review?.text?.text || ''
      const rating = Number(review?.rating) || 0
      const date =
        review?.relativePublishTimeDescription ||
        (review?.publishTime ? new Date(review.publishTime).toLocaleDateString() : '')

      return {
        id: review?.name || index,
        name,
        rating,
        date,
        text,
        avatar: name.trim().slice(0, 1).toUpperCase(),
        authorUrl: review?.authorAttribution?.uri,
      }
    })

    const out = json(reviews, { headers: { 'Cache-Control': 'public, max-age=43200' } })
    context.waitUntil(cache.put(cacheKey, out.clone()))
    return out
  } catch (error) {
    console.error('Reviews function failed', error)
    return json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
