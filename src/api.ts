import type { WorkshopProfile } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.rutiox.com';

export async function getWorkshopBySlug(slug: string): Promise<WorkshopProfile> {
  const res = await fetch(`${API_BASE}/api/v1/public/workshops/by-slug/${slug}`);
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export class NotFoundError extends Error {
  constructor() {
    super('Workshop not found');
  }
}
