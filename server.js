const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Serve static files from public folder
      if (pathname === '/manifest.json' || pathname === '/favicon.ico') {
        const filePath = path.join(__dirname, 'public', pathname)
        if (fs.existsSync(filePath)) {
          const contentType = pathname.endsWith('.json') 
            ? 'application/json' 
            : 'image/x-icon'
          res.setHeader('Content-Type', contentType)
          fs.createReadStream(filePath).pipe(res)
          return
        }
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
