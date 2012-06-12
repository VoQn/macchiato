
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
    charcode: function(){
       var g = C.frequency( [
            [ 400, C.choose( 0x41, 0x7a )],
            [ 300, C.choose( 0x30, 0x39 )],
            [ 150, C.choose( 0x1f, 0x2f )],
            [ 140, C.choose( 0x7b, 0x7f )],
            [ 7, C.choose( 0x80, 0xd7ff )],
            [ 2, C.choose( 0xe000, 0xfffd )],
            [ 1, C.choose( 0x10000, 0x10ffff )]
          ] );
      return Math.round( g() );
    },
    charator: function(){
      var i = method.charcode(),
          c = String.fromCharCode( i );
      return c;
    },
    string: function(){
      var cs = C.listOf( method.charcode )(),
          str = String.fromCharCode.apply( null, cs );
      return str;
    }
  };

  method.number = method.decimal;

  createSingleton( GenerateRefference, method );

  return new GenerateRefference();
})();

