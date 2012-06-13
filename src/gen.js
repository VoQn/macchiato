
var generateReference = (function( combinator ){
  var GenerateReference = function(){};

  var integerGenerator = function( n ){
    var i = combinator.choose( (-n), n )();
    return Math.round( i );
  };

  var decimalBaseDenom = 9999999999999;
  var numberGenerator = function( l ){
    var b = combinator.choose( 0, ( l ) )();
    var n = combinator.choose( (-b) * decimalBaseDenom, b * decimalBaseDenom )();
    var d = combinator.choose( 1, decimalBaseDenom )();
    return Math.round( n ) / Math.round( d );
  };

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
  var registration = function( type, callback ){
    if ( type === 'constructor' || type == 'register' ) { // Bad Hacking
      throw new Error('GenerateRefference.' + type + ' should not overwrite');
    }
    // TODO Check type signature
    GenerateReference.prototype[ type ] = callback;
  };

  GenerateReference.prototype.register = function(/* type, callback */){
    var args = Array.prototype.slice.call( arguments );
    if ( args.length === 2 && typeof args[ 0 ] === 'string' && typeof args[ 1 ] === 'function' ){
      // single entry registration
      registration( args[ 0 ], args[ 1 ] );
      return;
    }

    // bulk registration
    each( function( generator, type ){
      registration( type, generator );
    }, args[ 0 ] );
  };

  GenerateReference.prototype.register({
    bool: combinator.elements( [ false, true ] ),
    integer: combinator.sized( integerGenerator ),
    number: combinator.sized( numberGenerator ),
    charCode: function(){
      var generator = combinator.frequency( charCodeGenerateTable );
      var code = Math.round( generator() );
      return code;
    },
    charactor: function(){
      var code = GenerateReference.prototype.charCode();
      var a_char = String.fromCharCode( code );
      return a_char;
    },
    string: function(){
      var int_arr = combinator.listOf( GenerateReference.prototype.charCode )();
      var str = String.fromCharCode.apply( null, int_arr );
      return str;
    }
  });

  return new GenerateReference();
})( combinator );

