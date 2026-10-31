export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ccjaplmejbjhlgdxwvss.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0yBJtp03hbMZTzSmnqQSGA_rM7uQrso',
  dbHost: 'db.ccjaplmejbjhlgdxwvss.supabase.co',
  dbPort: 5432,
};

export async function fetchSupabaseTable(tableName: string) {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${tableName}?select=*`, {
      headers: {
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Supabase REST query failed for ${tableName}:`, err);
    return null;
  }
}
