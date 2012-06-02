var quadratic, Generator, arbitrary;

quadratic = function( a, _b, _c ){
  var b = _b || 1, c = _c || 0;
  return function( x, r ){
    return a * Math.pow( x, 2 ) + b * x + c;
  };
};

Generator = (function(){
  var Generator = function(){}, method, C = Combinator, instance;

  method = {
    bool: function( ){
      var b = C.elements([ false, true ])();
      return b;
    },
    integer: C.sized(function( n ){
        var i = C.choose( (-n), n )();
        return Math.round( i );
    }),
    decimal: C.sized(function( _n ){
        var prec = 9999999999999,
            b = C.choose( 0, ( _n ) )(),
            n = C.choose( (-b) * prec, b * prec )(),
            d = C.choose( 1, prec )();
        return Math.round( n ) / Math.round( d );
    }),
    charator: function(){
      var g = C.oneOf( [ C.choose( 0, 127 ), C.choose( 0, 255 ) ] )(),
          c = String.fromCharCode( g() );
      return c;
    }
  };

  method.number = method.decimal;
  method.string = function(){
    var cs = C.listOf1( method.charator )(), i = 0, l = cs.length, str = '';
    for ( ; i < l; i++ ) {
      str += cs[ i ];
    }
    return str;
  };

  instance = createSingleton( Generator, method );

  return instance;
})();

arbitrary = function(/* */){
  var types, gen;
  types = Array.prototype.slice.call( arguments, 0, arguments.length );
  gen = function( t ){
    var test = /\[\s+([a-z]+)\s+\]/.exec( t );
    if ( test ){
      return elements( Generator[ test[ 1 ] ] );
    }
    return Generator[ t ];
  };

  return map( gen, types );
};
