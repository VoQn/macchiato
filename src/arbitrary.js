/**
 * @param {string} type_str
 * @param {...string} var_args
 * @constructor
 */
var arbitrary = function( type_str, var_args ){
  /** @type {Array.<string>} */
  var args = Array.prototype.slice.call( arguments );
  return new arbitrary.fn.init( args );
};

/**
 * @type {arbitrary}
 */
arbitrary.fn = arbitrary.prototype = (function(){
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
        return combinator.listOf( generateReference[ test[ 1 ] ] );
     }
     return generateReference[ t ];
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
      var generators;
      /** @type {number} */
      var index = 0;
      /** @type {Array.<string>} */
      var types = this.types;
      /** @type {number} */
      var length = types.length;

      try {
        generators = map( selectGenerator, types );
      } catch ( e ) {
        if( console && console.log ){
          console.log( e );
        }
      }

      return forAll( generators, property );
    },
    /**
     * @param {number=} opt_count
     * @return {Array}
     */
    sample: function( opt_count ){
      /**
       * @param {number} _
       * @param {number} o
       * @return {number}
       */
      var fix = function( _, o ){
        return Math.max( 1, o );
      };
      /** @type {number} */
      var count = supplement( 10, opt_count, fix );
      /** @type {Array.<function():Object>} */
      var generators;
      /** @type {Array} */
      var values;
      /** @type {Array.<Array>} */
      var result = [];

      try {
        generators = map( selectGenerator, this.types );
      } catch ( e ){
        if ( console && console.log ){
          console.log( e );
        }
      }
      seed.clear();

      for ( ; !!count; count-- ){
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
})();

arbitrary.fn.init.prototype = arbitrary.fn;

