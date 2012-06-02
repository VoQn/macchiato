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

