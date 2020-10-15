const NAME = "super"
const PASS = "secret"

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 */

const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/

/**
 * RegExp for bearer token credentials
 *
 */
const BEARER_TOKEN_REGEXP = /^ *(?:[Bb][Ee][Aa][Rr][Ee][Rr]) +([A-Za-z0-9._~+/-]+=*) *$/

/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 */

const USER_PASS_REGEXP = /^([^:]*):(.*)$/

/**
 * Object to represent user credentials.
 */

const Credentials = function(name, pass) {
  this.name = name
  this.pass = pass
}

const checkBearerToken = function(string) {
    if (typeof string !== 'string') {
    return undefined
  }

  // parse header
  const match = BEARER_TOKEN_REGEXP.exec(string)

  if (!match) {
    return undefined
  }

  // return credentials object
  return true
}

/**
 * Parse basic auth to object.
 */

const parseAuthHeader = function(string) {
  if (typeof string !== 'string') {
    return undefined
  }

  // parse header
  const match = CREDENTIALS_REGEXP.exec(string)

  if (!match) {
    return undefined
  }

  // decode user pass
  const userPass = USER_PASS_REGEXP.exec(atob(match[1]))

  if (!userPass) {
    return undefined
  }

  // return credentials object
  return new Credentials(userPass[1], userPass[2])
}


const unauthorizedResponse = function(body) {
  return new Response(
    body, {
      status: 401,
       headers: {
        "WWW-Authenticate": 'Basic realm="User Visible Realm"'
      }

    }
  )
}

/**
 * Handle request
 */

async function handle(request) {
  const bearer_authorization = checkBearerToken(request.headers.get("Authorization"))
  if (bearer_authorization) {
     return fetch(request)
  }
  
  const credentials = parseAuthHeader(request.headers.get("Authorization"))
  if ( !credentials || credentials.name !== NAME ||  credentials.pass !== PASS ) {
    return unauthorizedResponse("Unauthorized")
  } else {
    request = new Request(request)
    request.headers.delete("Authorization")
    return fetch(request)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})
