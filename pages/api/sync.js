// Sync API - stores data in Vercel Edge Config or returns placeholder
// @vercel/kv not used - connect Upstash Redis via Vercel Marketplace for full sync
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  // Cloud sync requires Upstash Redis integration
  // Connect it from: Vercel Dashboard > Storage > Browse Marketplace > Upstash Redis
  return res.status(503).json({ 
    error: 'Cloud sync not configured yet. Add Upstash Redis from Vercel Marketplace.',
    info: 'https://vercel.com/marketplace?category=storage&search=redis'
  })
}
