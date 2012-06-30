
// testing environments
var numOnly = function(){
  return true;
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
      internalLinks = filter( hasInternalLink,  anchors );
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
     macchiato.setVerbose( evt.target.checked );
     return eventEnd();
  });

  if ( verbose_controller.parentNode.tagName === 'label' ) {
    add_event( verbose_controller.parentNode, 'click', function( evt ){
      verbose_controller.click();
      return eventEnd();
    });
  }

  var macchiatoTestRun = function( evt ){
    macchiato.taste();
    return eventEnd();
  };

  add_event( runner, 'click', macchiatoTestRun );
};

