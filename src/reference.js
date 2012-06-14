/**
 * @type {GenerateReference}
 */
var generateReference = (function(){
  /**
   * @constructor
   */
  var GenerateReference = function(){};

  /**
   * @type {GenerateReference}
   */
  var reference = new GenerateReference();

  /**
   * @param {number} n
   * @return {number}
   */
  var integerGenerator = function( n ){
    var i = combinator.choose( (-n), n )();
    return ~~i;
  };

  /**
   * @param {number} l
   * @return {number}
   */
  var numberGenerator = function( l ){
    var decimalBaseDenom = 999999999999999;
    var b = combinator.choose( 0, ( l ) )();
    var n = combinator.choose( (-b) * decimalBaseDenom, b * decimalBaseDenom )();
    var d = combinator.choose( 1, decimalBaseDenom )();
    return n / d;
  };

  /**
   * @type {Array.<Array.<number>>}
   */
  var charCodeHierarchy = [
    [ 400,    0x41,     0x7a ], // Alphabet
    [ 300,    0x30,     0x39 ], // Decimal Number
    [ 150,    0x1f,     0x2f ], // ASCII Symbol (1)
    [ 140,    0x7b,     0x7f ], // ASCII Symbol (2)
    [   7,    0x80,   0xd7ff ], // Unicode (1)
    [   2,  0xe000,   0xfffd ], // Unicode (2)
    [   1, 0x10000, 0x10ffff ]  // Unicode (3)
  ];

  /**
   * @param {Array.<number>} params
   * @return {Array.<(number|function():number)>}
   */
  var generatorLow = function( params ){
    var rate = params[ 0 ];
    var low  = params[ 1 ];
    var high = params[ 2 ];
    return [ rate, combinator.choose( low, high ) ];
  };

  /**
   * @type {Array.<Array.<(number|function():number)>>}
   */
  var charCodeGenerateTable = map( generatorLow, charCodeHierarchy );

  /**
   * @type {function():number}
   */
  var __charCodeGenerate = combinator.frequency( charCodeGenerateTable );

  /**
   * @return {number}
   */
  var charCodeGenerate = function(){
    return ~~__charCodeGenerate();
  };

  /**
   * @type {function():Array.<number>}
   */
  var charCodeArrayGenerate = combinator.listOf( charCodeGenerate );

  /**
   * @param {string} type
   * @param {function(): Object}
   * @return {GenerateReference}
   */
  var registration = function( type, callback ){
    if ( type == 'prototype' || type == 'register' ) { // Bad Hacking
      throw new Error('GenerateRefference.' + type + ' should not overwrite');
    }
    // TODO Check type signature
    reference[ type ] = callback;
    return reference;
  };

  /**
   * @param {string|Object} entry
   * @param {(function():Object)=} opt_callback
   * @return {GenerateReference}
   */
  reference.register = function( entry, opt_callback ){
    if ( arguments.length === 2 &&
         typeof entry === 'string' &&
         typeof opt_callback === 'function' ){
      // single entry registration
      registration( entry, opt_callback );
      return this;
    }

    // bulk registration
    each( flip( registration ), entry );
    return this;
  };

  reference.register({
    /**
     * @return {boolean}
     */
    'boolean': combinator.elements( [ false, true ] ),
    /**
     * @return {number}
     */
    integer: combinator.sized( integerGenerator ),
    /**
     * @return {number}
     */
    number: combinator.sized( numberGenerator ),
    /**
     * @return {number}
     */
    charCode: charCodeGenerate,
    /**
     * @return {string}
     */
    charactor: function(){
      var code = charCodeGenerate();
      var a_char = String.fromCharCode( code );
      return a_char;
    },
    /**
     * @return {string}
     */
    string: function(){
      var code_array = charCodeArrayGenerate();
      var str = String.fromCharCode.apply( null, code_array );
      return str;
    }
  });

  return reference;
})();

