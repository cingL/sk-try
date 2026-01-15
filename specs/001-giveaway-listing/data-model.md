# Data Model: 活动无料信息展示

**Branch**: `001-giveaway-listing`  
**Date**: 2026-01-13

## Entity Relationship Diagram

```
┌─────────────────────┐
│       Event         │
│─────────────────────│
│ id (PK)             │
│ name                │
│ start_time          │
│ end_time            │
│ location            │
│ status              │
│ created_at          │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐       ┌─────────────────────┐
│      Giveaway       │       │      Provider       │
│─────────────────────│       │─────────────────────│
│ id (PK)             │       │ id (PK)             │
│ event_id (FK)       │──────▶│ user_id (FK)        │
│ provider_id (FK)    │       │ name                │
│ title               │       │ booth_area          │
│ description         │       │ booth_number        │
│ images[]            │       │ external_links[]    │
│ pickup_condition    │       │ created_at          │
│ category            │       └─────────────────────┘
│ status              │                │
│ created_at          │                │
│ updated_at          │                │ 1:1
└─────────────────────┘                ▼
                              ┌─────────────────────┐
                              │    auth.users       │
                              │─────────────────────│
                              │ id (PK)             │
                              │ email               │
                              │ (Supabase Auth)     │
                              └─────────────────────┘
```

---

## Entity Definitions

### Event (活动)

代表一场集会或展会活动。

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | 唯一标识符 |
| `name` | VARCHAR(200) | NOT NULL | 活动名称 |
| `start_time` | TIMESTAMPTZ | NOT NULL | 开始时间 |
| `end_time` | TIMESTAMPTZ | NOT NULL | 结束时间 |
| `location` | VARCHAR(500) | NOT NULL | 活动地点 |
| `status` | ENUM | NOT NULL, DEFAULT 'upcoming' | 活动状态 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 |

**Status Values**:
- `upcoming`: 即将开始
- `ongoing`: 进行中
- `ended`: 已结束

**Validation Rules**:
- `end_time` MUST be after `start_time`
- `name` MUST be non-empty

---

### Giveaway (无料信息)

代表一条无料/互换物品信息。

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | 唯一标识符 |
| `event_id` | UUID | FK → Event.id, NOT NULL | 所属活动 |
| `provider_id` | UUID | FK → Provider.id, NOT NULL | 提供者 |
| `title` | VARCHAR(100) | NOT NULL | 物品名称 |
| `description` | TEXT | NOT NULL | 详细描述 |
| `images` | TEXT[] | NOT NULL, MIN 1 | 图片 URL 数组 |
| `pickup_condition` | TEXT | NULLABLE | 领取条件 |
| `category` | VARCHAR(50) | NULLABLE | 物品类别 |
| `status` | ENUM | NOT NULL, DEFAULT 'available' | 物品状态 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新时间 |

**Status Values**:
- `available`: 可领取
- `limited`: 数量有限
- `ended`: 已结束

**Validation Rules**:
- `title` MUST be 1-100 characters
- `description` MUST be non-empty
- `images` MUST contain at least 1 image URL
- `category` values: `goods`, `print`, `digital`, `other`

**Indexes**:
- `idx_giveaway_event` on `event_id`
- `idx_giveaway_provider` on `provider_id`
- `idx_giveaway_status` on `status`
- `idx_giveaway_search` on `title, description` (Full-text)

---

### Provider (提供者)

代表发布无料信息的社团或个人。

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | 唯一标识符 |
| `user_id` | UUID | FK → auth.users.id, UNIQUE | 关联用户 |
| `name` | VARCHAR(100) | NOT NULL | 显示名称 |
| `booth_area` | VARCHAR(20) | NOT NULL | 摊位区域 (如 A, B, C) |
| `booth_number` | VARCHAR(20) | NOT NULL | 摊位编号 (如 01, 02) |
| `external_links` | JSONB | NULLABLE | 外部链接数组 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 创建时间 |

**External Links Structure**:

```json
[
  {
    "platform": "twitter",
    "username": "example_user",
    "url": "https://twitter.com/example_user",
    "scheme": "twitter://user?screen_name=example_user"
  },
  {
    "platform": "pixiv",
    "username": "12345678",
    "url": "https://pixiv.net/users/12345678",
    "scheme": "pixiv://users/12345678"
  }
]
```

**Validation Rules**:
- `name` MUST be 1-100 characters
- `booth_area` + `booth_number` combination SHOULD be unique per event
- `external_links[].platform` MUST be one of: `twitter`, `pixiv`, `website`, `other`

**Indexes**:
- `idx_provider_user` on `user_id`
- `idx_provider_booth` on `booth_area, booth_number`

---

## State Transitions

### Giveaway Status

```
                  ┌──────────────┐
                  │  available   │ ← Initial state
                  └──────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │  limited   │ │   ended    │ │ (deleted)  │
   └─────┬──────┘ └────────────┘ └────────────┘
         │              ▲
         └──────────────┘

Transitions:
- available → limited: Provider marks as limited quantity
- available → ended: Provider marks as ended
- limited → ended: Provider marks as ended
- Any → deleted: Soft delete (status preserved, row hidden)
```

### Event Status

```
   ┌──────────────┐
   │   upcoming   │ ← Initial state (start_time > NOW)
   └──────┬───────┘
          │ (auto: start_time reached)
          ▼
   ┌──────────────┐
   │   ongoing    │ ← Active state
   └──────┬───────┘
          │ (auto: end_time reached)
          ▼
   ┌──────────────┐
   │    ended     │ ← Terminal state
   └──────────────┘

Note: Status transitions are automatic based on timestamps
```

---

## TypeScript Types

```typescript
// types/index.ts

export type EventStatus = 'upcoming' | 'ongoing' | 'ended';
export type GiveawayStatus = 'available' | 'limited' | 'ended';
export type GiveawayCategory = 'goods' | 'print' | 'digital' | 'other';
export type LinkPlatform = 'twitter' | 'pixiv' | 'website' | 'other';

export interface ExternalLink {
  platform: LinkPlatform;
  username: string;
  url: string;
  scheme?: string;
}

export interface Event {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  status: EventStatus;
  createdAt: Date;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  boothArea: string;
  boothNumber: string;
  externalLinks: ExternalLink[];
  createdAt: Date;
}

export interface Giveaway {
  id: string;
  eventId: string;
  providerId: string;
  title: string;
  description: string;
  images: string[];
  pickupCondition?: string;
  category?: GiveawayCategory;
  status: GiveawayStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Joined type for list display
export interface GiveawayWithProvider extends Giveaway {
  provider: Provider;
}
```

---

## Database Schema (Supabase/PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Event status enum
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'ended');

-- Giveaway status enum
CREATE TYPE giveaway_status AS ENUM ('available', 'limited', 'ended');

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(500) NOT NULL,
  status event_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  booth_area VARCHAR(20) NOT NULL,
  booth_number VARCHAR(20) NOT NULL,
  external_links JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT unique_user UNIQUE (user_id)
);

-- Giveaways table
CREATE TABLE giveaways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  pickup_condition TEXT,
  category VARCHAR(50),
  status giveaway_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT at_least_one_image CHECK (array_length(images, 1) >= 1)
);

-- Indexes
CREATE INDEX idx_giveaway_event ON giveaways(event_id);
CREATE INDEX idx_giveaway_provider ON giveaways(provider_id);
CREATE INDEX idx_giveaway_status ON giveaways(status);
CREATE INDEX idx_provider_user ON providers(user_id);

-- Full-text search index
CREATE INDEX idx_giveaway_search ON giveaways 
  USING GIN (to_tsvector('simple', title || ' ' || description));

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaways ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT USING (true);

CREATE POLICY "Providers are viewable by everyone"
  ON providers FOR SELECT USING (true);

CREATE POLICY "Giveaways are viewable by everyone"
  ON giveaways FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Users can create their own provider profile"
  ON providers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider profile"
  ON providers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create giveaways for their provider"
  ON giveaways FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own giveaways"
  ON giveaways FOR UPDATE USING (
    EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
  );
```

---

## Storage Structure (Supabase Storage)

```
giveaway-images/
├── {event_id}/
│   └── {giveaway_id}/
│       ├── original/
│       │   └── {uuid}.{ext}     # Original uploaded image
│       └── thumbnails/
│           └── {uuid}_300.{ext} # 300x300 thumbnail
```

**Storage Policies**:
- Public read access for all images
- Authenticated write access for image upload
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp
