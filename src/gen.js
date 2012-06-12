
var generateRefference = (function(){
  var GenerateRefference = function(){};

  var decimalBaseDenom = 9999999999999;

  var charCodeHierarchy = [
    [ 400,    0x41,     0x7a ], // Alphabet
    [ 300,    0x30,     0x39 ], // Decimal Number
    [ 150,    0x1f,     0x2f ], // ASCII Symbol (1)
    [ 140,    0x7b,     0x7f ], // ASCII Symbol (2)
    [   7,    0x80,   0xd7ff ], // Unicode (1)
    [   2,  0xe000,   0xfffd ], // Unicode (2)
    [   1, 0x10000, 0x10ffff ]  // Unicode (3)
  ];

  var generatorLow = function( params ){
    var rate = params[ 0 ];
    var low  = params[ 1 ];
    var high = params[ 2 ];
    return [ rate, combinator.choose( low, high ) ];
  };

  var charCodeGenerateTable = map( generatorLow, charCodeHierarchy );

  var method = {
    bool: function( ){
      var b = combinator.elements([ false, true ])();
      return b;
    },
    integer: combinator.sized(function( n ){
        var i = combinator.choose( (-n), n )();
        return Math.round( i );
    }),
    decimal: combinator.sized(function( _n ){
        var b = combinator.choose( 0, ( _n ) )();
        var n = combinator.choose( (-b) * decimalBaseDenom, b * decimalBaseDenom )();
        var d = combinator.choose( 1, decimalBaseDenom )();
        return Math.round( n ) / Math.round( d );
    }),
    charCode: function(){
      var generator = combinator.frequency( charCodeGenerateTable );
      var code = Math.round( generator() );
      return code;
    },
    charator: function(){
      var code = method.charCode();
      var a_char = String.fromCharCode( code );
      return a_char;
    },
    string: function(){
      var int_arr = combinator.listOf( method.charCode )();
      var str = String.fromCharCode.apply( null, int_arr );
      return str;
    }
  };

  method.number = method.decimal;

  createSingleton( GenerateRefference, method );

  return new GenerateRefference();
})();

