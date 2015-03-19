var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var osc = require('node-osc');

var lpmtOscClient = new osc.Client('127.0.0.1', 8888);
var fluxusOscClient = new osc.Client('127.0.0.1', 8889);


http.createServer(function (req, res) {

	var reqUrl = req.url;
	//console.log(reqUrl);
	var reqArr = reqUrl.split("/");
	//console.log(reqArr);
	
	switch(reqArr[1]){
		case 'api':
			//POSTare su questi url le richieste alla API per ottenere risposte in json
			//console.log('api request');
			//console.log(req);
			
			var POST = "";

			req.on("data", function(chunk) {
				POST += chunk;
				//console.log(POST);
				
				
				
				if (POST.length > 1e6){
					req.end("Too much data!");
				}
                		
				var post = qs.parse(POST);
				//console.log(post);
				
				
				switch(post.control){
					case 'setSources':
						//console.log(post.data);
						
						var data = eval('('+post.data+')');
						
						for(s in data){
							lpmtOscClient.send('/active/set', parseInt(s));
							lpmtOscClient.send('/active/cam/show', 1);
							lpmtOscClient.send('/active/cam/num', parseInt(data[s]));
							
							console.log("Source "+data[s]+" to quad #"+s);
						}
						
						
						res.writeHeader(200);
						
						
						var result = {
							
							gui:"sourcesPreset",
							status:"OK",
							message:"Sources set!",
						
						}
						res.end(JSON.stringify(result));
					break;
					
					case 'fireFlux':
						
						console.log(post.data);
						console.log(post);
						
						fluxusOscClient.send(post.data);
						
						var result = {
							
							gui:"fluxusScene",
							status:"OK",
							message:"Fluxus scene set!",
						
						}
						res.end(JSON.stringify(result));
						
					break;
					
					default:
						res.writeHeader(401);
						res.end();
				}
				
			});
			
		break;
		
		default:
			var filePath = './client' + reqUrl;
			//console.log('filePath: '+filePath);
			
			if ((filePath == './client') || (filePath == './client/')){
				filePath = './client/index.html';
			}
				
		
			var extname = path.extname(filePath);
			var contentType = 'text/html';
			switch (extname) {
				case '.html':
					contentType = 'text/html';
					break;
				case '.js':
					contentType = 'text/javascript';
					break;
				case '.css':
					contentType = 'text/css';
					break;
				case '.json':
					contentType = 'application/json';
					break;
				default:
					contentType = 'text/plain';
					
				
			}
	
			fs.exists(filePath, function(exists) {
	
				if (exists) {
					fs.readFile(filePath, function(error, content) {
						if (error) {
							res.writeHead(500);
							res.end();
						}
						else {
							res.writeHead(200, { 'Content-Type': contentType });
							res.end(content, 'utf-8');
						}
					});
				}
				else {
					res.writeHead(404);
					res.end();
				}
			});
	}
	
	
}).listen(1337, '0.0.0.0');
console.log('Server running at http://0.0.0.0:1337/');
