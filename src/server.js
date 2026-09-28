import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { list, add, toggle, remove } from './store.js'

const PORT = Number(process.env.PORT ?? 4000)
const PUBLIC_DIR = new URL('../public', import.meta.url).pathname
const DATA_DIR = new URL('../data', import.meta.url).pathname

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' }

function json(res, code, body) {
  const payload = JSON.stringify(body)
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(payload) })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        resolve({})
      }
    })
  })
}

function serveStatic(req, res) {
  const name = req.url === '/' ? '/index.html' : req.url.split('?')[0]
  const file = join(PUBLIC_DIR, name)
  if (!existsSync(file)) return json(res, 404, { error: 'not found' })
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
}

export const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/api/todos' && req.method === 'GET') return json(res, 200, list())

  if (url.pathname === '/api/todos' && req.method === 'POST') {
    const body = await readBody(req)
    return json(res, 201, add(body.title))
  }

  if (url.pathname.startsWith('/api/todos/') && req.method === 'PATCH') {
    const id = url.pathname.slice('/api/todos/'.length)
    const t = toggle(id)
    return t ? json(res, 200, t) : json(res, 404, { error: 'not found' })
  }

  // 과제 4: 삭제에 확인 절차가 없다 — 요청 한 번으로 즉시 지운다.
  if (url.pathname.startsWith('/api/todos/') && req.method === 'DELETE') {
    const id = url.pathname.slice('/api/todos/'.length)
    return remove(id) ? json(res, 204, {}) : json(res, 404, { error: 'not found' })
  }

  if (req.method === 'GET') return serveStatic(req, res)
  json(res, 405, { error: 'method not allowed' })
})

if (process.argv[1]?.endsWith('server.js')) {
  server.listen(PORT, () => console.log(`todo-ops listening on http://localhost:${PORT}`))
}
