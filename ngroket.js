#!/usr/bin/env node

var args = process.argv.slice(2),
	sys = require('sys'),
	spawn = require('child_process').spawn,
	fs = require('fs'),
	YAML = require('yamljs'),
	WebSocket = require('ws');

if (args[0] === "-h") {
	console.log("\n\tUsage: <command> [auth_token] [private_websocket] [...]");
	console.log("\tExample: ./ngroket xxx_xxxxxx 10.0.1.30 10.0.1.11\n")
}

var ngrok_config = { auth_token: args[0], tunnels: {} };
var ngrok_args = [];

ngrok_args.push('-config');
ngrok_args.push('config.yaml');
ngrok_args.push('start');

for (var i = 1; i < args.length; i++) { 
	proxy_socket(args[i], i, function(socketRef, port) {
		ngrok_args.push(socketRef);
		ngrok_config.tunnels[socketRef] = { 
			proto: { 
				tcp: port 
			} 
		};
	});
}

fs.writeFile("config.yaml", YAML.stringify(ngrok_config, 10, 2), function(err) {
	if (err) {
		console.log(err);
	} else {
		var ngrok = spawn("ngrok", ngrok_args);
		ngrok.on('exit', function(code) {
			process.exit(code);
		});
	}
});

function proxy_socket(socket, socketCount, cb) {

	var proxy_port = 8080 + socketCount,
		WebSocketServer = WebSocket.Server,
		wss = new WebSocketServer({ port: proxy_port });

	wss.on('connection', function(ws) {
		var remotews = new WebSocket('ws://' + socket + '/ws');

		remotews.on('open', function() {
			remotews.on('message', function(data) {
				if (ws.readyState == WebSocket.OPEN) {
					ws.send(data);
				}
			});
		});

		remotews.on('close', function() {});
		remotews.on('error', function(e) {});

		ws.on('close', function() {});
		ws.on('error', function(e) {});	
	});

	cb("socket" + socketCount, proxy_port);
}
