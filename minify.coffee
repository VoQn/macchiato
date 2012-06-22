validateOption = (label, parameters, opt_param) ->
  if opt_param
    for type of parameters
      if parameters.hasOwnProperty(type) and opt_param is parameters[type]
        return
    throw new Error("unknown #{label}: #{opt_param}")
  return

validate = (option) ->
  validateOption "compilation_level", LEVEL, option.compilation_level
  validateOption "output_info", OUTPUT_INFO_TYPE, option.output_info

createBody = (code, option) ->
  querystring.stringify
    js_code: code
    output_format: "json"
    output_info: option.output_info or OUTPUT_INFO_TYPE.COMPILED
    compilation_level: option.compilation_level or LEVEL.SIMPLE

createRequestParams = (body) ->
  params = REQUEST_PARAMS
  params["Content-Length"] = body.length
  params

compile = (code, next, option = {}) ->
  body = createBody(code, option)
  params = createRequestParams(body)
  try
    validate option
    client = http.createClient(PORT, HOST).on("error", next)
    request = client.request("POST", "/compile", params)
    request.on "error", next
    request.on "response", createResponse(next)
    request.end body
  catch exception
    next exception
  return

createResponse = (next) ->
  parseResponse = createParseResponse(next)
  _on_response = (res) ->
    if res.statusCode isnt 200
      next new Error("Unexpected HTTP response: #{res.statusCode}")
    else
      capture res, "utf-8", parseResponse

capture = (input, encoding, next) ->
  buffer = []
  index = 0
  input.on "data", _get_data = (chunk) ->
    buffer[index] = chunk.toString(encoding)
    index++

  input.on "end", _receive_all = ->
    next null, buffer.join("")

  input.on "error", next
  return

createParseResponse = (next) ->
  _json_loaded = (err, obj) ->
    e = undefined
    if err
      next err
    else if e = obj.errors or obj.serverErrors or obj.warnings
      next new Error("Failed complete: #{sys.inspect e}")
    else
      next null, obj.compiledCode
    return

  _parse_response = (error, data) ->
    if error
      next error
    else
      loadJSON data, _json_loaded
    return

loadJSON = (data, next) ->
  error = undefined
  object = undefined
  try
    object = JSON.parse(data)
  catch err
    error = err
  next error, object

writeJsFile = (error, compiled) ->
  if error
    sys.puts sys.inspect(error)
    return
  fs.writeFile dist, compiled, _after_write = (e) ->
    throw e  if e
    console.log "saved #{dist}"

writeMinJS = (err, data) ->
  code = undefined
  console.log err  if err
  compile data, writeJsFile,
    compilation_level: LEVEL.SIMPLE
    output_info: OUTPUT_INFO_TYPE.COMPILED

sys = require("util")
fs = require("fs")
http = require("http")
querystring = require("querystring")

LEVEL =
  SIMPLE: "SIMPLE_OPTIMIZATIONS"
  WHITE_SPACE: "WHITE_SPACE_ONLY"
  ADVANSED: "ADVANCED_OPTIMIZATIONS"

OUTPUT_INFO_TYPE =
  WARNING: "WARNING"
  ERROR: "ERRORS"
  COMPILED: "COMPILED_CODE"
  STATISTICS: "STATISTICS"

HOST = "closure-compiler.appspot.com"

PORT = 80

CONTENT_TYPE = "application/x-www-form-urlencoded"

REQUEST_PARAMS =
  host: HOST
  "Content-Type": CONTENT_TYPE

source = "./dist/macchiato.js"
dist = "./dist/macchiato.min.js"

fs.readFile source, "utf-8", writeMinJS
