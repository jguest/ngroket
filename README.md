## ngroket

This is a simple cl tool for quickly exposing private websockets; it uses [ws][https://github.com/einaros/ws] to create proxy sockets and [ngrok][https://ngrok.com/] to expose them. Make sure you have _node.js_, _npm_, and _ngrok_ installed. If not, the instructions below include a setup using [homebrew][http://brew.sh/] for Mac OS X. Note: you'll need an auth key from ngrok to expose non-http services (it's free, just sign up).

Installation:
```bash
$ brew install ngrok
$ brew install node
$ git clone example.git
$ cd /example/path
$ npm install
$ chmod u+x app.js
$ ./app.js -h
```
Example usage:
```bash
$ <command> [auth_key] [socket] [...]
$ ./app.js xxxxxx 10.0.1.30 10.0.1.11
```
