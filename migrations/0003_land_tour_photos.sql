-- Cover photos for La Route du Thé and Personalised Tours, added after 0002 was applied locally.
-- OR IGNORE keeps this safe if 0002 is ever regenerated from scripts/seed-data.mjs, which now lists them too.
INSERT OR IGNORE INTO media (id, r2_key, mime, bytes, width, height, alt_en, created_at) VALUES ('2fe4957f565ebcd83d8b52ee', 'seed/2fe4957f565ebcd83d8b52ee.jpg', 'image/jpeg', 297930, 1200, 800, 'La Route du Thé', 1793145600000);
INSERT OR IGNORE INTO tour_media (tour_id, media_id, sort_order) VALUES (3, '2fe4957f565ebcd83d8b52ee', 0);
UPDATE tours SET cover_media_id = '2fe4957f565ebcd83d8b52ee' WHERE id = 3 AND cover_media_id IS NULL;
INSERT OR IGNORE INTO media (id, r2_key, mime, bytes, width, height, alt_en, created_at) VALUES ('f44822cf647186f698b3003a', 'seed/f44822cf647186f698b3003a.jpg', 'image/jpeg', 341038, 1600, 1067, 'Personalised Tours', 1793145600000);
INSERT OR IGNORE INTO tour_media (tour_id, media_id, sort_order) VALUES (4, 'f44822cf647186f698b3003a', 0);
UPDATE tours SET cover_media_id = 'f44822cf647186f698b3003a' WHERE id = 4 AND cover_media_id IS NULL;
