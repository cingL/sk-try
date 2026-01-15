-- Muryo Giveaway App - Initial Database Schema
-- Execute this script in Supabase SQL Editor

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

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for giveaways table
CREATE TRIGGER update_giveaways_updated_at
  BEFORE UPDATE ON giveaways
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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
