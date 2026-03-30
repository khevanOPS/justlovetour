export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(501).json({ error: "Cloudinary gallery is not configured" });
  }

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "tags=jlt_gallery AND resource_type=image",
          sort_by: [{ created_at: "desc" }],
          max_results: 100,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch gallery",
        details: data,
      });
    }

    const images = (data.resources || []).map((img) => ({
      id: img.asset_id,
      url: img.secure_url,
    }));

    return res.status(200).json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch gallery" });
  }
}
