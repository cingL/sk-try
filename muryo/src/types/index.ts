// Type definitions for Muryo Giveaway App

export type EventStatus = 'upcoming' | 'ongoing' | 'ended';
export type GiveawayStatus = 'available' | 'limited' | 'ended';
export type GiveawayCategory = 'goods' | 'print' | 'digital' | 'other';
export type LinkPlatform = 'rednote' | 'weibo' | 'website' | 'other';

export interface ExternalLink {
  platform: LinkPlatform;
  username: string;
  url: string;
  scheme?: string;
}

// Database types (matching Supabase schema with snake_case)
export interface Event {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  location: string;
  status: EventStatus;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  name: string;
  booth_area: string;
  booth_number: string;
  external_links: ExternalLink[];
  created_at: string;
}

export interface Giveaway {
  id: string;
  event_id: string;
  provider_id: string;
  title: string;
  description: string;
  images: string[];
  pickup_condition?: string;
  category?: GiveawayCategory;
  status: GiveawayStatus;
  created_at: string;
  updated_at: string;
}

// Joined type for list display
export interface GiveawayWithProvider extends Giveaway {
  provider: Provider;
}
