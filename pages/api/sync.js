import { kv } from '@vercel/kv'
const MAX_SIZE_KB = 512
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  const userId = req.method === 'GET' ? req.query.userId : req.body?.userId
  if (!userId || userId.length < 4) return res.status(400).json({ error: 'userId required' })
  const key = `we:user:${userId.slice(0, 64)}`
  if (req.method === 'GET') {
    try {
      const data = await kv.get(key)
      if (!data) return res.status(404).json({ error: 'No data found' })
      return res.status(200).json({ ok: true, data })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  if (req.method === 'POST') {
    const { data } = req.body
    if (!data) return res.status(400).json({ error: 'data required' })
    const sizeKB = Buffer.byteLength(JSON.stringify(data)) / 1024
    if (sizeKB > MAX_SIZE_KB) return res.status(413).json({ error: `Too large: ${sizeKB.toFixed(0)}KB` })
    try {
      await kv.set(key, data, { ex: 60 * 60 * 24 * 365 })
      return res.status(200).json({ ok: true, savedAt: Date.now(), sizeKB: sizeKB.toFixed(1) })
    } catch (e) { return res.status(500).json({ error: e.message }) }
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
