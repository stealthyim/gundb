require('dotenv').config();

const port = process.env.GUN_PORT || 5444;
const Gun = require('gun');

function hasValidToken (msg) {
  return msg && msg && msg.headers && msg.headers.token && msg.headers.token === process.env.GUN_TOKEN
}

// Add listener
Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  // Check all incoming traffic
  ctx.on('in', function (msg) {
    var to = this.to
    // restrict put
    if (msg.put) {
      if (hasValidToken(msg)) {
        console.log('writing')
        to.next(msg)
      } else {
        console.log('not writing')
      }
    } else {
      to.next(msg)
    }
  })
})

const server = require('http').createServer((req, res) => {
  // filters gun requests!
  if (Gun.serve(req, res)) {
    return
  }
  require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error', function () {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(require('fs')
      .readFileSync(require('path')
        .join(__dirname, 'index.html')
      ))
  }).pipe(res)
})

const gun = Gun({
  file: 'data.json', // local testing and development,
  web: server,
  s3: {
    key: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key
    secret: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Token
    bucket: process.env.AWS_S3_BUCKET, // The bucket you want to save into
    region: process.env.AWS_REGION
  }
});

// Sync everything
gun.on('out', { get: { '#': { '*': '' } } })

server.listen(port)

console.log('GUN server (restricted put) started on port: ' + port)
console.log('Use CTRL + C to stop it')
