util = require 'util'
fs   = require 'fs'
exec = require('child_process').exec
compiler = require('./lib/closure-compiler').compiler

utf8 = "utf-8"
app_name = "macchiato"

src_dir = "./src"
dist_dir = "./dist"

js_file = "#{dist_dir}/web/#{app_name}.js"
min_js_file = "#{dist_dir}/web/#{app_name}.min.js"
lib_js_file = "#{dist_dir}/lib/#{app_name}.js"

base_deps = [
    'util/object'
    'util/interface'
    'util/functional'
    'util/iterator'
    'util/tuple'
    'util/time'
    'views/view'
    'views/console'
    'check'
    'score'
    'seed'
    'combinator'
    'reference'
    'arbitrary'
    'checker'
    'macchiato'
  ]

web_deps = [
    'util/object'
    'util/interface'
    'util/functional'
    'util/iterator'
    'util/tuple'
    'util/time'
    'util/dom'
    'views/view'
    'views/console'
    'views/html'
    'check'
    'score'
    'seed'
    'combinator'
    'reference'
    'arbitrary'
    'checker'
    'macchiato'
  ]

node_deps = [
    'util/object'
    'util/interface'
    'util/functional'
    'util/iterator'
    'util/tuple'
    'util/time'
    'views/view'
    'views/console'
    'check'
    'score'
    'seed'
    'combinator'
    'reference'
    'arbitrary'
    'checker'
    'macchiato'
    'footer'
  ]

getLib = (deps) ->
  str = []
  for name in deps
    str.push "#{src_dir}/#{name}.js"
  str.join(' ')

task 'all', "All Distrbution", (options) ->
  fs.mkdir "dist", null, (err, stdout, stderr) ->
    invoke 'web'
    invoke 'node'

task 'clean', "Clean distribution directory", (option) ->
  exec "rm -rf #{dist_dir}"

task 'web', "Distribution js file for web front end", (options) ->
  libs = getLib web_deps
  util.puts libs

  fs.mkdir "dist/web", null, (err, stdout, stderr) ->
    exec "cat #{libs} > #{js_file}", (err, stdout, stderr) ->
      source_code = fs.readFileSync js_file, utf8
      compiler.compile source_code, (error, data) ->
        util.puts(util.inspect(error)) if error
        fs.writeFileSync min_js_file, data.compiledCode, utf8
    util.puts "distribute #{js_file} and #{min_js_file}"

task 'node', "Node.js module", (option) ->
  libs = getLib node_deps
  util.puts libs

  fs.mkdir "dist/lib", null, (err, stdout, stderr) ->
    exec "cat #{libs} > #{lib_js_file}", (err, stdout, stderr) ->
      util.puts "distribute #{lib_js_file}"

#EOF
