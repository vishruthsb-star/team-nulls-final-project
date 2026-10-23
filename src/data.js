const CLEAN_DATA_URL = '/data/l3pilot_clean.json';

export async function loadData() {
  const response = await fetch(CLEAN_DATA_URL);
  if (!response.ok) throw new Error(`Could not load cleaned data (${response.status}).`);
  return response.json();
}
