export interface CategorySummary {
  id: string;
  name: string;
  iconEmoji: string | null;
}

export interface ServiceSummary {
  id: string;
  name: string;
  categoryId: string | null;
}

export interface RatingSummary {
  avg: number | null;
  count: number;
}

export interface WorkshopProfile {
  id: number;
  name: string;
  address: string;
  phoneNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  categories: CategorySummary[];
  logoUrl: string | null;
  photoUrls: string[];
  services: ServiceSummary[];
  rating: RatingSummary;
  avgResponseTimeMinutes: number | null;
  responseTimeBadge: string | null;
  slug: string;
}
