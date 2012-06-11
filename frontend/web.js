
var eventEnd = function(){
  if ( event.cancelBubble ){
    event.cancelBubble = true;
  }
  if ( event.stopPropagation ){
    event.stopPropagation();
  }
  return false;
};

// testing environments

var verbose = false;

var setVerbose = function(){
  verbose = event.target.checked;
  return eventEnd();
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

var add_event = (function(){
  if ( document.addEventListener ){
    return function( node, type, handler ){
      node.addEventListener( type, handler, false );
    };
  } else if ( document.attachEvent ) {
    return function( node, type, handler ){
      node.attachEvent('on' + type, function( evt ){
        handler.call( node, evt );
      });
    };
  } else {
    return function( node, type, handler ){
      var _handler = node[ 'on' + type ];
      node[ 'on' + type ] = function( evt ){
        if (_handler) {
          _handler.call( node, evt || eindow.evt );
        }
        handler.call( node, evt );
      };
    };
  }
})();

var add_on_load = function( callback ){
  add_event( window, 'load', callback );
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
  var anchors = document.getElementsByTagName( 'a' ),
      hasInternalLink = function( anchor ){
        return anchor.getAttribute( 'href' ).match( /^#[a-zA-Z0-9_\-]+$/i );
      },
      internalLinks = filter( hasInternalLink,  anchors);
  each( function( anchor ){
    anchor.onclick = function( ){
        return scrollWithAdjust( anchor, header_tool_bar_id );
    };
  }, internalLinks );

  return this;
};

var initTestConstroller = function( identifiers ){
  /**
   * identifiers = {
   *   counter_id: <string>
   *   verbose_id: <string>
   *   runner_id: <string>
   * }
   */
  var count_controller = document.getElementById( identifiers.counter_id ),
      verbose_controller = document.getElementById( identifiers.verbose_id ),
      runner = document.getElementById( identifiers.runner_id );

  if ( count_controller.parentNode.tagName === 'label' ){
    add_event( count_controller.parentNode, 'click', function( evt ){
      count_controller.focus();
    });
  }

  add_event( verbose_controller, 'click', function( evt ){
     Macchiato.setVerbose( evt.target.checked );
     return eventEnd();
  });

  if ( verbose_controller.parentNode.tagName === 'label' ) {
    add_event( verbose_controller.parentNode, 'click', function( evt ){
      verbose_controller.click();
      return eventEnd();
    });
  }

  add_event( runner, 'click', function( evt ){
    Macchiato.taste();
    return eventEnd();
  });
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
