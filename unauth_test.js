require('dotenv').config();
const Gun = require('gun');
const gunServer = process.env.GUN_SERVER || 'http://localhost:4040/gun'
const gun = new Gun(gunServer)

gun.get('zzz').put({
  name: "888124",
  email: "888124@test.io",
});

gun.get('zzz').on(function(data, key){
  console.log("update:", data);
});
