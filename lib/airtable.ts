const AIRTABLE_BASE_ID = "appk3RCqRPphjE5i6";
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small: { url: string; width: number; height: number };
    large: { url: string; width: number; height: number };
    full: { url: string; width: number; height: number };
  };
}

export interface Photo {
  id: string;
  Category: string;
  Attachments: AirtableAttachment[];
}

export interface Review {
  id: string;
  "Customer Name": string;
  Location: string;
  "Review Text": string;
  Stars: number;
  "Service Type": string;
}

export interface PricingRow {
  id: string;
  Size: string;
  Style: string;
  "No Foundation": number;
  "Wood Foundation": number;
  "Concrete Foundation": number;
}

export interface Settings {
  [key: string]: string;
}

interface AirtableRecord<T> {
  id: string;
  fields: T;
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[];
}

async function fetchTable<T>(tableName: string): Promise<(T & { id: string })[]> {
  if (!AIRTABLE_API_TOKEN) {
    throw new Error("AIRTABLE_API_TOKEN is not configured");
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${tableName}: ${response.statusText}`);
  }

  const data: AirtableResponse<T> = await response.json();
  return data.records.map((record) => ({
    id: record.id,
    ...record.fields,
  })) as (T & { id: string })[];
}

export async function getPhotos(): Promise<Photo[]> {
  const photos = await fetchTable<Omit<Photo, "id">>("Photos");
  // Only keep photos that actually have an image attachment
  return photos.filter((p) => p.Attachments && p.Attachments.length > 0);
}

export async function getReviews(): Promise<Review[]> {
  const reviews = await fetchTable<Omit<Review, "id">>("Reviews");
  // Only keep reviews that have actual content
  return reviews.filter((r) => r["Review Text"] && r["Customer Name"]);
}

export async function getPricing(): Promise<PricingRow[]> {
  const pricing = await fetchTable<Omit<PricingRow, "id">>("Pricing");
  // Only keep rows that have a size and style
  return pricing.filter((p) => p.Size && p.Style);
}

export async function getSettings(): Promise<Settings> {
  const records = await fetchTable<{ Key: string; Value: string }>("Settings");
  const settings: Settings = {};
  for (const record of records) {
    const value = record.Value;
    // Skip empty values and unfilled Airtable placeholders like "(paste image URL here)"
    if (
      record.Key &&
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !value.trim().startsWith("(")
    ) {
      settings[record.Key] = value;
    }
  }
  return settings;
}

export async function getAllData() {
  const [photos, reviews, pricing, settings] = await Promise.all([
    getPhotos().catch(() => [] as Photo[]),
    getReviews().catch(() => [] as Review[]),
    getPricing().catch(() => [] as PricingRow[]),
    getSettings().catch(() => ({}) as Settings),
  ]);

  return { photos, reviews, pricing, settings };
}
