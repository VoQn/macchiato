
/**
 * @constructor
 */
function GenerateReference(){}
/**
 * @type {GenerateReference}
 */
var generateReference = new GenerateReference();

/**
 * @param {string|Object} entry
 * @param {(function():Object)=} opt_callback
 * @return {GenerateReference}
 */
generateReference.register = function( entry, opt_callback ){
  /**
   * @param {string} type
   * @param {function(): Object}
   * @return {GenerateReference}
   */
  var _registration_ = function( type, callback ){
    if ( type == 'prototype' || type == 'register' ) { // Bad Hacking
      throw new Error('GenerateRefference.' + type + ' should not overwrite');
    }
    // TODO Check type signature
    generateReference[ type ] = callback;
    return generateReference;
  },
    _flip_regist_ = flip( _registration_ );

  if ( arguments.length === 2 &&
       typeof entry === 'string' &&
       typeof opt_callback === 'function' ){
    // single entry registration
    _registration_( entry, opt_callback );
  } else {
    // bulk registration
    eachKeys( _flip_regist_, entry );
  }
  return this;
};

/**
 * @const {function(number):number}
 */
var charCodeGenerate = combinator.frequency([
  tuple( 400, combinator.choose( 0x41, 0x7a ) ), // Alphabet
  tuple( 300, combinator.choose( 0x30, 0x39 ) ), // Decimal Number
  tuple( 150, combinator.choose( 0x1f, 0x2f ) ), // ASCII Symbol (1)
  tuple( 140, combinator.choose( 0x7b, 0x7f ) ), // ASCII Symbol (2)
  tuple(   7, combinator.choose( 0x80, 0xd7ff ) ), // Unicode (1)
  tuple(   2, combinator.choose( 0xe000, 0xfffd ) ), // Unicode (2)
  tuple(   1, combinator.choose( 0x10000, 0x10ffff ) )  // Unicode (3)
]);

generateReference.register({
  /** @type {function(number):boolean} */
  'boolean': combinator.elements( [ false, true ] ),
  /** @type {function(number):number} */
  integer: combinator.sized(function _generate_integer_by_progress( progress ){
    var v = combinator.chooseNow( -progress, progress );
    return v;
  }),
  /** @type {function(number):number} */
  number: combinator.sized(function _generate_number_by_progress( progress ){
    /** alias */
    var choose = combinator.chooseNow,
        /** @const {number} */
        BASE = 1e10 - 1,
        b = choose( 0, progress ),
        n = choose( -b * BASE, b * BASE ),
        d = choose( 1, BASE ),
        v = n / d;
    return v;
  }),
  /** @type {function(number):number} */
  charCode: charCodeGenerate,
  /** @type {function(number):string} */
  charactor: function( progress ){
    return String.fromCharCode( charCodeGenerate( progress ) );
  },
  /** @type {function(number):string} */
  string: combinator.listOf(
              charCodeGenerate,
              function _to_string( array ){
                return String.fromCharCode.apply( null, array );
              })
});

