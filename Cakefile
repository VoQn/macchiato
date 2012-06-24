util = require 'util'
fs   = require 'fs'
exec = require('child_process').exec
compiler = require('./lib/closure-compiler').compiler

utf8 = "utf-8"
app_name = "macchiato"

src_dir = "./src"
dist_dir = "./dist"

js_file = "#{dist_dir}/#{app_name}.js"
min_js_file = "#{dist_dir}/#{app_name}.min.js"

deps = [
  'util/object'
  'util/functional'
  'util/iterator'
  'util/tuple'
  'util/time'
  'util/interface'
  'check'
  'score'
  'seed'
  'combinator'
  'reference'
  'arbitrary'
  'checker'
  'view'
  'macchiato'
  ]

task 'all', "All Distrbution", (options) ->
  invoke 'web'

task 'web', "Distribution js file for web front end", (options) ->
  libs = for lib in deps
    "#{src_dir}/#{lib}.js"

  exec "cat #{libs.join(' ')} > #{js_file}", (err, stdout, stderr) ->

    source_code = fs.readFileSync js_file, utf8

    compiler.compile source_code, (error, data) ->

      util.puts(util.inspect(error)) if error

      fs.writeFileSync min_js_file, data.compiledCode, utf8

  util.puts "distribute #{js_file} and #{min_js_file}"

#EOF
