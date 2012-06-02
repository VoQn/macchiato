var eventEnd = function(){
  event.stopPropagation();
  window.event.cancelBubble = true;
}

// testing environments

var verbose = false;

var checkVerbose = function(){
  var checkBox = document.getElementById( 'verbose' ), b = checkBox.checked;
  checkBox.checked = verbose = !b;
  eventEnd();
}

var setVerbose = function(){
  verbose = event.target.checked;
  eventEnd();
}

var numOnly = function(){
  return true;
}

var htmlEscape = (function(){
  var map = {"<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&#39;","\"": "&quot;"}
    , replaceStr = function( s ){ return map[ s ]; };
  return function( str ){
    return str.replace( /<|>|&|'|"/g, replaceStr );
  };
})();

window.onload = function(){/*
  var map = {
    'var|function|return|for|while|in|switch|case|default|break|typeof':'keyword',
    '(-?[0-9]+\.?[0-9]+)|true|false':'literal',
    '([\"\'])\'.*?\"':'string'
    '[\+\-=<>~]+|':'operator'
  }
  var strReg = /([\"\'])(?:[^\1\\]|(?:\\.))*?\1/
  var source_code_dom = document.querySelectorAll( 'pre.sample-code > code' );*/
}

// user's tests
Macchiato.stock({
  'number x, y => x + y == y + x' : prop(
    arbitrary( 'number', 'number' )
    , function( x, y ){
        return x + y == y + x;
  }),
  'string str => str == true' : prop(
    arbitrary( 'string' )
    , function( str ){
        return !!str;
  }),
  'integer x, y => div(x, y) * y + (x % y) == x' : prop(
    arbitrary( 'integer', 'integer' )
    , function( x, y ){
        return where( [ y != 0 ], function( x, y ){
          var n = Math.floor( x / y )
            , d = Math.floor( x % y );
          return n * y + d == x;
        });
  })
});