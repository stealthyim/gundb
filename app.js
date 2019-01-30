require('dotenv').config();

var express = require('express');
var port = process.env.GUN_PORT || 5444;
var Gun = require('gun');

var app = express();
app.use(Gun.serve);
app.use(express.static(__dirname));

var server = app.listen(port);

var gun = Gun({
  file: 'data', // local testing and development,
  web: server,
  s3: {
    key: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key
    secret: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Token
    bucket: process.env.AWS_S3_BUCKET, // The bucket you want to save into
    region: process.env.AWS_REGION
  }
});

console.log('\n\n\n\n****************************************\n\n');
console.log('UGUN Server started on port ' + port + ' with /gun');
