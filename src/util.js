// Utility
var is_list, is_empty, map, each, createSingleton;

is_list = function( obj ) {
  var i = 0, classes = [ Array, NodeList, HTMLCollection ], l = classes.length;
  while ( i < l ){
    if ( obj instanceof classes[ i ] ){
      return true;
    }
    i++;
  }
  return false;
};

is_empty = function( obj ){
  var _;
  for ( _ in obj ){
    return false;
  }
  return true;
};

map = function( callback, elements ){
  var i = 0, l, r = [];
  if ( is_list( elements ) ){
    l = elements.length;
    while ( i < l ){
      r[ i ] = callback( elements[ i ], i );
      i++;
    }
  } else {
    r = {};
    for ( i in elements ){
      if ( elements.hasOwnProperty( i ) ){
        r[ i ] = callback( elements[ i ], i );
      }
    }
  }
  return r;
};

each = function( callback, elements ){
  var i = 0, l;
  if ( is_list( elements ) ){
    l = elements.length;
    while ( i < l ){
      callback( elements[ i ] );
      i++;
    }
  } else {
    for ( i in elements ) {
      if ( elements.hasOwnProperty( i ) ){
        callback( elements[ i ], i );
      }
    }
  }
};

createSingleton = function( obj, methods ){
  obj.prototype = methods;
  return new obj();
};
