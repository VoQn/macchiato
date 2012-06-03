var eventEnd, verbose, checkVerbose, setVerbose, numOnly, clearNode, htmlEscape;

eventEnd = function(){
  event.stopPropagation();
  window.event.cancelBubble = true;
};

// testing environments

verbose = false;

checkVerbose = function(){
  var checkBox = document.getElementById( 'verbose' ), b = checkBox.checked;
  checkBox.checked = verbose = !b;
  eventEnd();
};

setVerbose = function(){
  verbose = event.target.checked;
  eventEnd();
};

numOnly = function(){
  return true;
};

clearNode = function( node ){
  while( node.firstChild ){
    node.removeChild( node.firstChild );
  }
  return node;
};

htmlEscape = (function(){
  var map = {"<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&#39;","\"": "&quot;"}
    , replaceStr = function( s ){ return map[ s ]; };
  return function( str ){
    return str.replace( /<|>|&|'|"/g, replaceStr );
  };
})();

