import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import claudeHandler from './api/claude.js'
import notifyHandler from './api/notify.js'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.ANTHROPIC_API_KEY ||= env.ANTHROPIC_API_KEY
  process.env.DISCORD_WEBHOOK_URL ||= env.DISCORD_WEBHOOK_URL

  async function runApiHandler(handler, req, res) {
    const body = await readRequestBody(req)
    const request = new Request(`http://localhost${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: body || undefined,
    })
    const response = await handler(request)
    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))
    res.end(await response.text())
  }

  return {
    plugins: [
      react(),
      {
        name: 'local-claude-api',
        configureServer(server) {
          server.middlewares.use('/api/claude', async (req, res) => {
            try {
              await runApiHandler(claudeHandler, req, res)
            } catch (error) {
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ error: 'Local Claude API failed', detail: String(error) }))
            }
          })
          server.middlewares.use('/api/notify', async (req, res) => {
            try {
              await runApiHandler(notifyHandler, req, res)
            } catch (error) {
              res.statusCode = 500
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify({ error: 'Local Discord notify API failed', detail: String(error) }))
            }
          })
        },
      },
    ],
  }
})
