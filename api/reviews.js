export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return res
      .status(501)
      .json({ error: "GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID not configured" });
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch reviews",
        details: data,
      });
    }

    const reviews = (data.reviews || []).map((review, index) => {
      const name = review?.authorAttribution?.displayName || "Google User";
      const text = review?.text?.text || "";
      const rating = Number(review?.rating) || 0;
      const date =
        review?.relativePublishTimeDescription ||
        (review?.publishTime ? new Date(review.publishTime).toLocaleDateString() : "");

      return {
        id: review?.name || index,
        name,
        rating,
        date,
        text,
        avatar: name.trim().slice(0, 1).toUpperCase(),
        authorUrl: review?.authorAttribution?.uri,
      };
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
