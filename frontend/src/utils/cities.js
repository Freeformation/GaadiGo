export const FALLBACK_CITIES = [
  'All Cities',
  'Bengaluru',
  'Goa',
  'Delhi NCR',
  'Mumbai',
  'Pune',
  'Hyderabad',
];

export async function fetchLiveCities() {
  try {
    const res = await fetch('/api/vehicles/cities');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.warn('Using fallback cities:', err);
  }
  return FALLBACK_CITIES;
}
