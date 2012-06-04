// Utility
var is_list = function( obj ) {
  var i = 0, classes = [ Array, NodeList, HTMLCollection ], l = classes.length;
  while ( i < l ){
    if ( obj instanceof classes[ i ] ){
      return true;
    }
    i++;
  }
  return false;
};

var is_empty = function( obj ){
  var _;
  for ( _ in obj ){
    return false;
  }
  return true;
};

var map = function( callback, elements ){
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

var each = function( callback, elements ){
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

var filter = function( callback, elements ){
  var i = 0, xs = elements, l = xs.length, f = callback, r = [], x, t;
  for ( ; i < l; i++ ){
    x = xs[ i ];
    t = f( x, i );
    if ( t ){
      r.push( x );
    }
  }
  return r;
};


var createSingleton = function( obj, methods ){
  obj.prototype = methods;
  return new obj();
};

