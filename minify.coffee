# Requirements
fs = require('fs')
util = require('util')
compiler = require('./lib/closure-compiler').compiler

# ---------------------------------------------------
# Variables
utf8 = 'utf-8'
dist_dir  = './dist'
app_name  = 'macchiato'
js_file   = "#{dist_dir}/#{app_name}.js"
dist_file = "#{dist_dir}/#{app_name}.min.js"

# ---------------------------------------------------
# Compile js file
source_code = fs.readFileSync js_file, utf8

compiler.compile source_code, ( error, data ) ->
  fs.writeFileSync dist_file, data.compiledCode, utf8
  console.log "compiled #{js_file} to #{dist_file}"

#EOF
