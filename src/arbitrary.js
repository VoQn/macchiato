/**
 * @param {string} type_str
 * @param {...string} opt_more_types
 * @constructor
 */
var arbitrary = function( type_str, opt_more_types ){
  /** @type {Array.<string>} */
  var args = Array.prototype.slice.call( arguments, 0, arguments.length );
  return new arbitrary.fn.init( args );
};

/**
 * @type {arbitrary}
 */
arbitrary.fn = arbitrary.prototype = (function( combinator, reference ){
  /** @type {RegExp} */
  var rList = /\[\s?([a-z]+)\s?\]/;
  /**
   * @param {string} t
   * @return {function():Object}
   */
  var selectGenerator = function( t ){
     /** @type {?Array.<string>} */
     var test = rList.exec( t );
     if ( !!test ){
        return combinator.listOf( reference[ test[ 1 ] ] );
     }
     return reference[ t ];
  };

  return {
    constructor: arbitrary,
    /**
     * @param {!Array.<string>} types
     * @constructor
     */
    init: function( types ){
      this.length = types.length;
      this.types = types;
      return this;
    },
    /** @type {Array.<string>} */
    types: [],
    /** @type {number} */
    length: 0,
    /** @type {function():number} */
    size: function(){
      return this.length;
    },
    /**
     * @param {function(Object, ...Object):(boolean|{wasSkipped:boolean})}
     * @return {function():Result}
     */
    property: function( property ){
      /** @types {Array.<function():Object>}*/
      var generators = [],
          /** @type {number} */
          i = 0,
          /** @type {Array.<string>} */
          ts = this.types,
          /** @type {number} */
          l = ts.length;
      for ( ; i < l; i++ ){
        try {
          var generator = selectGenerator( ts[ i ] );
          generators[ i ] = generator;
        } catch ( e ) {
          if( console && console.log ){
            console.log( e );
          }
        }
      }
      return forAll( generators, property );
    },
    sample: function( opt_count ){
      var count = supplement( 10, opt_count, function( _, o ){ return Math.max( 1, o ); });
      var index = 0;
      var generators;
      var values;
      var result = [];
      try {
        generators = map( selectGenerator, this.types );
      } catch ( e ){
        if ( console && console.log ){
          console.log( e );
        }
      }
      seed.clear();
      for ( ; index < count; index++ ){
        values = map( force, generators );
        if ( console && console.log ){
          console.log( values.length === 1 ? values[ 0 ] : values );
        }
        result.push( values );
        seed.grow();
      }
      return result;
    }
  };
})( combinator, generateReference );

arbitrary.fn.init.prototype = arbitrary.fn;

