
var quadratic = function( a, _b, _c ){
  var b = _b || 1, c = _c || 0;
  return function( x, r ){
    return a * Math.pow( x, 2 ) + b * x + c;
  };
};

var GenerateRefference = (function(){
  var GenerateRefference = function(){},
      method,
      C = Combinator;

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
      var g = C.oneOf( [ C.choose( 0, 127 ), C.choose( 0xe000, 0xfffd ), C.choose( 0x10000, 0x10ffff ) ] )(),
          c = String.fromCharCode( Math.round( g() ) );
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

  createSingleton( GenerateRefference, method );

  return new GenerateRefference();
})();

var Generator = function( gs ){
  this.generators = gs;
  return this;
};

Generator.prototype.property = function( property ){
  return forAll( this.generators, property );
};

var arbitrary = function(/* */){
  var types, prepare, instance;

  types = Array.prototype.slice.call( arguments, 0, arguments.length );

  prepare = function( t ){
    var test = /\[\s+([a-z]+)\s+\]/.exec( t );
    if ( test ){
      return elements( Generator[ test[ 1 ] ] );
    }
    return GenerateRefference[ t ];
  };

  instance = new Generator( map( prepare, types ) );

  return instance;
};

