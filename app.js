require('dotenv').config();
console.log('New HTTP config loaded');
;(function(){
	var cluster = require('cluster');
	if(cluster.isMaster){
	  return cluster.fork() && cluster.on('exit', function(){ cluster.fork() });
	}

	var fs = require('fs');
	var config = { port: process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.GUN_PORT || process.argv[2] || 8765 };
	var Gun = require('gun')

	if(process.env.HTTPS_KEY){
		config.key = fs.readFileSync(process.env.HTTPS_KEY);
		config.cert = fs.readFileSync(process.env.HTTPS_CERT);
		config.server = require('https').createServer(config, Gun.serve(__dirname));
	} else {
		config.server = require('http').createServer(Gun.serve(__dirname));
	}

	var gun = Gun({
    web: config.server.listen(config.port),
    s3: {
      key: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key
      secret: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Token
      bucket: process.env.AWS_S3_BUCKET, // The bucket you want to save into
      region: process.env.AWS_REGION
    }
  });

	console.log('Relay peer started on port ' + config.port + ' with /gun');
}());
