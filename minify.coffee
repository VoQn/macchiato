
fs = require('fs')
util = require('util')
googleClosureCompiler = require('./lib/closure-compiler')

compiler = googleClosureCompiler.client

source = "./dist/macchiato.js"
dist = "./dist/macchiato.min.js"

writeJsFile = (error, data) ->
  if error
    util.puts util.inspect(error)
    return
  compiled = data.compiledCode
  fs.writeFile dist, compiled, _after_write_ = (err) ->
    throw err  if err
    console.log "saved #{dist}"

writeMinJS = (err, data) ->
  code = undefined
  console.log err  if err
  compiler.compile data, writeJsFile

fs.readFile source, "utf-8", writeMinJS
