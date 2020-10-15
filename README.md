Most of the code has been copy-pasted from https://github.com/jshttp/basic-auth

# Why

I use it to protect static pages and unathorized API endpoint in "transparent proxy" (server does not know, that Auth is used on Cloudflare side). When browser get Bearer Token from API it passes it to server for authorized endpoinds usage.
# Usage

1. Set credentials in `index.js`
```
const NAME = "super"
const PASS = "secret"
```
3. Save and copy `index.js` to your cloudflare worker and deploy
