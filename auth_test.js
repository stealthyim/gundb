require('dotenv').config();
const Gun = require('gun');

Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  ctx.on('out', function (msg) {
    var to = this.to
    // Adds headers for put
    msg.headers = {
      token: process.env.GUN_TOKEN
    }
    to.next(msg) // pass to next middleware
  })
})

const gunServer = process.env.GUN_SERVER || 'http://localhost:4040/gun'
const gun = new Gun(gunServer)

gun.get('zzz').put({
  name: "888124",
  email: "888124@test.io",
});

gun.get('zzz').on(function(data, key){
  console.log("update:", data);
});
