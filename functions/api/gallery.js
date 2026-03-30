function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...init,
  })
}

export async function onRequestGet(context) {
  const cloudName = context.env.CLOUDINARY_CLOUD_NAME
  const apiKey = context.env.CLOUDINARY_API_KEY
  const apiSecret = context.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return json({ error: 'Cloudinary gallery is not configured' }, { status: 501 })
  }

  try {
    const auth = btoa(`${apiKey}:${apiSecret}`)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: 'tags=jlt_gallery AND resource_type=image',
        sort_by: [{ created_at: 'desc' }],
        max_results: 100,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return json(
        {
          error: 'Failed to fetch gallery',
          details: data,
        },
        { status: response.status }
      )
    }

    const images = (data.resources || []).map((image) => ({
      id: image.asset_id,
      url: image.secure_url,
    }))

    return json(images)
  } catch (error) {
    console.error('Gallery function failed', error)
    return json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}
