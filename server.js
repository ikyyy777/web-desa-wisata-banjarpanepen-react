import { createServer } from 'http'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { render } from './dist/server/entry-server.js'

const template = readFileSync(resolve('dist/client/index.html'), 'utf-8')

createServer((req, res) => {
  const url = req.url
  
  try {
    const appHtml = render(url)
    const html = template.replace('<!--app-html-->', appHtml)
    
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  } catch (e) {
    res.statusCode = 500
    res.end(e.message)
  }
}).listen(3000)