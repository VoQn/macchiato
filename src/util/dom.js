
var eventEnd = function(){
  if ( event.cancelBubble ){
    event.cancelBubble = true;
  }
  if ( event.stopPropagation ){
    event.stopPropagation();
  }
  return false;
};

var clearNode = function( node ){
  while( node.firstChild ){
    node.removeChild( node.firstChild );
  }
  return node;
};

var add_event;
if (document.addEventListener) {
  add_event = function (node, type, handler) {
    node.addEventListener(type, handler, false);
  };
} else if (document.attachEvent) {
  add_event = function (node, type, handler) {
    node.attachEvent('on' + type, function (evt) {
        handler.call(node, evt);
    });
  };
} else {
  add_event = function (node, type, handler) {
    var old_handler = node['on' + type];
    if (old_handler) {
      node['on' + type] = function (evt) {
        old_handler.call(node, evt || eindow.evt);
        handler.call(node, evt);
      };
    } else {
      node['on' + type] = function (evt) {
        handler.call(node, evt);
      };
    }
  };
}

var add_on_load = function (callback) {
  add_event(window, 'load', callback);
};

var htmlEscape = function (str) {
  var escapeMap = {
    "<":"&lt;",
    ">":"&gt;",
    "&":"&amp;",
    "'":"&#39;",
    "\"": "&quot;" 
  };
  return str.replace( /<|>|&|'|"/g, function (s) {
    return escapeMap[s];
  });
};


