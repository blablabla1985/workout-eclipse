export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    app: 'Workout Eclipse',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    kvConfigured: !!process.env.KV_REST_API_URL,
  })
}
