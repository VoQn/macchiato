
var generateReference = (function(){
  var choose = combinator.choose,
      listOf = combinator.listOf,
      frequency = combinator.frequency,
      sized = combinator.sized,
      elements = combinator.elements,
      /**
       * @constructor
       */
      GenerateReference = function(){},
      /**
       * @type {GenerateReference}
       */
      reference = new GenerateReference();

  /**
   * @param {number} n
   * @return {number}
   */
  var integerGenerator = function( n ){
    var num = choose( -n, n )();
    return Math.round( num );
  };

  /** @const {number} */
  var decimalBase = 9999999999999999;

  var b, n, d;
  /**
   * @param {number} l
   * @return {number}
   */
  var numberGenerator = function( l ){
    b = choose( 0, ( l ) )();
    n = choose( (-b) * decimalBase, b * decimalBase )();
    d = choose( 1, decimalBase )();
    return n / d;
  };

  /**
   * @type {function():number}
   * @const
   */
  var charCodeGenerate_ = frequency([
    tuple( 400, choose( 0x41, 0x7a ) ), // Alphabet
    tuple( 300, choose( 0x30, 0x39 ) ), // Decimal Number
    tuple( 150, choose( 0x1f, 0x2f ) ), // ASCII Symbol (1)
    tuple( 140, choose( 0x7b, 0x7f ) ), // ASCII Symbol (2)
    tuple(   7, choose( 0x80, 0xd7ff ) ), // Unicode (1)
    tuple(   2, choose( 0xe000, 0xfffd ) ), // Unicode (2)
    tuple(   1, choose( 0x10000, 0x10ffff ) )  // Unicode (3)
  ]);

  /** @type {number} */
  var charCode = 0x41;

  /**
   * @return {number}
   */
  var charCodeGenerate = function(){
    charCode = charCodeGenerate_();
    return Math.round( charCode );
  };

  /**
   * @type {function(number):Array.<number>}
   */
  var charCodeArrayGenerate = listOf( charCodeGenerate );

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
    } else {
      // bulk registration
      each( flip( registration ), entry );
    }
    return this;
  };

  reference.register({
    /** @type {function():boolean} */
    'boolean': elements( [ false, true ] ),
    /** @type {function(number):number} */
    integer: sized( integerGenerator ),
    /** @type {function(number):number} */
    number: sized( numberGenerator ),
    /** @type {function():number} */
    charCode: charCodeGenerate,
    /** @type {function():string} */
    charactor: function( progress ){
      return String.fromCharCode( charCodeGenerate() );
    },
    /** @type {function(number):string} */
    string: function( progress ){
      return String.fromCharCode.apply( null, charCodeArrayGenerate( progress ) );
    }
  });
  return reference;
})();

