-- Just Love Tour: content, media, admin accounts and audit log.
-- Times are unix epoch milliseconds. Prices are whole euro cents.

CREATE TABLE admins (
  id            INTEGER PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at    INTEGER NOT NULL,
  last_login_at INTEGER
);

CREATE TABLE sessions (
  id          INTEGER PRIMARY KEY,
  admin_id    INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  ip          TEXT,
  user_agent  TEXT
);
CREATE INDEX sessions_expires ON sessions(expires_at);

-- Fixed-window counters for login throttling, keyed like "ip:1.2.3.4" or "email:x@y".
CREATE TABLE rate_limits (
  key          TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL
);

CREATE TABLE media (
  id          TEXT PRIMARY KEY,           -- random id, also the R2 key suffix
  r2_key      TEXT NOT NULL UNIQUE,
  mime        TEXT NOT NULL,
  bytes       INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,
  alt_en      TEXT NOT NULL DEFAULT '',
  alt_fr      TEXT NOT NULL DEFAULT '',
  alt_ru      TEXT NOT NULL DEFAULT '',
  created_at  INTEGER NOT NULL,
  created_by  INTEGER REFERENCES admins(id)
);

CREATE TABLE tours (
  id               INTEGER PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  category         TEXT NOT NULL CHECK (category IN ('land', 'sea', 'adventure')),
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order       INTEGER NOT NULL DEFAULT 0,
  price_mode       TEXT NOT NULL DEFAULT 'on_request' CHECK (price_mode IN ('fixed', 'on_request')),
  price_adult_eur  INTEGER,
  price_child_eur  INTEGER,
  start_time       TEXT,                   -- "09:00"
  end_time         TEXT,                   -- "17:00"
  cover_media_id   TEXT REFERENCES media(id) ON DELETE SET NULL,
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL,
  updated_by       INTEGER REFERENCES admins(id)
);
CREATE INDEX tours_public ON tours(status, sort_order);

-- One row per tour per language. Lists are JSON arrays of strings.
CREATE TABLE tour_translations (
  tour_id          INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  lang             TEXT NOT NULL CHECK (lang IN ('en', 'fr', 'ru')),
  name             TEXT NOT NULL,
  summary          TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  stops            TEXT NOT NULL DEFAULT '[]',
  included         TEXT NOT NULL DEFAULT '[]',
  extras           TEXT NOT NULL DEFAULT '[]',
  meta_title       TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (tour_id, lang)
);

CREATE TABLE tour_media (
  tour_id    INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  media_id   TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (tour_id, media_id)
);

CREATE TABLE gallery_items (
  id         INTEGER PRIMARY KEY,
  media_id   TEXT NOT NULL UNIQUE REFERENCES media(id) ON DELETE CASCADE,
  tour_id    INTEGER REFERENCES tours(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at INTEGER NOT NULL
);
CREATE INDEX gallery_public ON gallery_items(status, sort_order);

CREATE TABLE transfer_destinations (
  id         INTEGER PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  name_en    TEXT NOT NULL,
  name_fr    TEXT NOT NULL DEFAULT '',
  name_ru    TEXT NOT NULL DEFAULT '',
  media_id   TEXT REFERENCES media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden'))
);

-- Editable page copy: hero, why-us, about, FAQ, footer. value is JSON.
CREATE TABLE content_blocks (
  key        TEXT NOT NULL,
  lang       TEXT NOT NULL CHECK (lang IN ('en', 'fr', 'ru')),
  value      TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by INTEGER REFERENCES admins(id),
  PRIMARY KEY (key, lang)
);

-- Site-wide settings (contact details, social links, exchange rates). value is JSON.
CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by INTEGER REFERENCES admins(id)
);

CREATE TABLE audit_log (
  id          INTEGER PRIMARY KEY,
  admin_id    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,              -- e.g. "tour.update", "media.upload", "auth.login"
  entity_type TEXT,
  entity_id   TEXT,
  summary     TEXT NOT NULL,
  before_json TEXT,
  after_json  TEXT,
  ip          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX audit_recent ON audit_log(created_at DESC);
