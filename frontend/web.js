
var eventEnd = function(){
  event.stopPropagation();
  window.event.cancelBubble = true;
};

// testing environments

var verbose = false;

var checkVerbose = function(){
  var checkBox = document.getElementById( 'verbose' ), b = checkBox.checked;
  checkBox.checked = verbose = !b;
  eventEnd();
};

var setVerbose = function(){
  verbose = event.target.checked;
  eventEnd();
};

var numOnly = function(){
  return true;
};

var clearNode = function( node ){
  while( node.firstChild ){
    node.removeChild( node.firstChild );
  }
  return node;
};

var htmlEscape = (function(){
  var map = {
    "<":"&lt;",
    ">":"&gt;",
    "&":"&amp;",
    "'":"&#39;",
    "\"": "&quot;"
  };
  return function( str ){
    return str.replace( /<|>|&|'|"/g, function( s ){
      return map[ s ];
    } );
  };
})();

var add_on_load = function( callback ){
  var old = window.onload;
  if ( typeof old == 'function' ){
    window.onload = function(){
      old();
      callback();
    };
  } else {
    window.onload = callback;
  }
  return this;
};

var scrollWithAdjust = function( anchor, header_tool_bar_id ){
  var header = document.getElementById( header_tool_bar_id ),
      selector = anchor.getAttribute('href'),
      hash = selector.substring( 1 ),
      target = document.getElementById( hash ),
      offset, y;
  location.hash = hash;
  offset = header.getBoundingClientRect().height || 0;
  y = target.getBoundingClientRect().top || 0;
  if ( y - offset !== 0 ){
    window.scrollBy(0, y - offset);
  }
  return false;
};

var setInternalAnchorBehavior = function( header_tool_bar_id ){
  var hasInternalLink = function( anchor ){
    return anchor.getAttribute( 'href' ).match( /^#[a-zA-Z0-9_\-]+$/i );
  };

  return function(){
    var anchors = document.getElementsByTagName( 'a' ),
        internalLinks = filter( hasInternalLink,  anchors);

    each( function( anchor ){
      anchor.onclick = function( ){
          return scrollWithAdjust( anchor, header_tool_bar_id );
      };
    }, internalLinks );

    return this;
  };
};

/** Not Use
var easing = function( time, from, distance, duration ){
  return distance * time / duration + from;
};

var smoothScroll = function( distance, duration ){
  var begin = new Date() - 0, from = 0, id, time;
  id = setInterval(function(){
    time = new Date() - begin;
    current = easing( time, from, distance, duration );
    if ( time > duration ){
      clearInterval( id );
      current = from + distance;
    }
    window.scrollBy( 0, current );
  }, 10);
};
**/
