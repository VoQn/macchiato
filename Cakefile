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

deps =
  util: [
    'object'
    'interface'
    'functional'
    'iterator'
    'tuple'
    'time'
    'dom'
  ]
  views: [
    'view'
    'console'
    'html'
  ]
  core: [
    'check'
    'score'
    'seed'
    'combinator'
    'reference'
    'arbitrary'
    'checker'
    'macchiato'
  ]

getLib = () ->
  str = []
  for sub, names of deps
    for name in names
      if sub is "core"
        str.push "#{src_dir}/#{name}.js"
      else
        str.push "#{src_dir}/#{sub}/#{name}.js"
  str.join(' ')

task 'all', "All Distrbution", (options) ->
  invoke 'web'

task 'clean', "Clean distribution directory", (option) ->
  exec "rm -rf #{dist_dir}"

task 'web', "Distribution js file for web front end", (options) ->
  libs = getLib()
  util.puts libs

  exec "cat #{libs} > #{js_file}", (err, stdout, stderr) ->

    source_code = fs.readFileSync js_file, utf8

    compiler.compile source_code, (error, data) ->

      util.puts(util.inspect(error)) if error

      fs.writeFileSync min_js_file, data.compiledCode, utf8

  util.puts "distribute #{js_file} and #{min_js_file}"

#EOF
