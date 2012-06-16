/**
 * @param {string} type_str
 * @param {...string} var_args
 * @constructor
 */
var arbitrary = function( type_str, var_args ){
  var args = Array.prototype.slice.call( arguments );
  return new arbitrary.fn.init( args );
};

/**
 * @type {arbitrary}
 */
arbitrary.fn = arbitrary.prototype = (function(){
  var rList = /\[\s?([a-z]+)\s?\]/,
     /**
      * @param {string} t
      * @return {function():Object}
      */
      selectGenerator = function( t ){
        /** @type {?Array.<string>} */
        var test = rList.exec( t ),
            listOf = combinator.listOf;
        if ( !!test ){
          return listOf( generateReference[ test[ 1 ] ] );
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
    length: 0,
    /**
     * @return {number}
     */
    size: function(){
      return this.length;
    },
    /**
     * @param {function(Object, ...Object):(boolean|{wasSkipped:boolean})}
     * @return {function():Result}
     */
    property: function( property ){
      var generators,
          index = 0,
          types = this.types,
          length = types.length;
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
      var fix = function( _, o ){
            return Math.max( 1, o );
          },
          count = supplement( 10, opt_count, fix ),
          generators;
          values;
          result = [];
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

