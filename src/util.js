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
  var i = 0, l, r = [], f = callback, xs = elements;
  if ( is_list( xs ) ){
    l = xs.length;
    while ( i < l ){
      r[ i ] = f( xs[ i ], i );
      i++;
    }
  } else {
    r = {};
    for ( i in xs ){
      if ( xs.hasOwnProperty( i ) ){
        r[ i ] = f( xs[ i ], i );
      }
    }
  }
  return r;
};

each = function( callback, elements ){
  var i = 0, l, f = callback, xs = elements;
  if ( is_list( xs ) ){
    l = xs.length;
    while ( i < l ){
      f( xs[ i ] );
      i++;
    }
  } else {
    for ( i in xs ) {
      if ( xs.hasOwnProperty( i ) ){
        f( xs[ i ], i );
      }
    }
  }
};

createSingleton = function( obj, methods ){
  obj.prototype = methods;
  return new obj();
};
