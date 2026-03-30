import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Optional: Google Places Reviews (Place Details - New)
// Set these in your hosting environment if you want the site to always show the latest reviews.
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

app.get("/api/gallery", async (req, res) => {
  try {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return res
        .status(501)
        .json({ error: "Cloudinary gallery is not configured" });
    }

    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`,
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
      return res
        .status(response.status)
        .json({ error: "Failed to fetch gallery", details: data });
    }

    const images = (data.resources || []).map((img) => ({
      id: img.asset_id,
      url: img.secure_url,
    }));

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
      return res
        .status(501)
        .json({ error: "GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID not configured" });
    }

    // Place Details (New): https://places.googleapis.com/v1/places/PLACE_ID
    // Only request what we need (keeps billing down).
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(
        GOOGLE_PLACE_ID
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch reviews", details: data });
    }

    const reviews = (data.reviews || []).map((r, idx) => {
      const name = r?.authorAttribution?.displayName || "Google User";
      const text = r?.text?.text || "";
      const rating = Number(r?.rating) || 0;

      // Prefer relative publishTimeDescription if available; fallback to timestamp.
      const date =
        r?.relativePublishTimeDescription ||
        (r?.publishTime ? new Date(r.publishTime).toLocaleDateString() : "");

      const avatar = name.trim().slice(0, 1).toUpperCase();

      return {
        id: r?.name || idx,
        name,
        rating,
        date,
        text,
        avatar,
        // Optional attribution fields if you want to show a "Read on Google" link later.
        authorUrl: r?.authorAttribution?.uri,
      };
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.listen(8787, () => {
  console.log("Gallery API running on http://localhost:8787");
});
