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
arbitrary.fn = arbitrary.prototype = (function(){
  /** @type {RegExp} */
  var rList = /\[\s+([a-z]+)\s+\]/,
      /**
       * @param {string} t
       * @return {function():Object}
       */
      selectGenerator = function( t ){
        /** @type {?Array.<string>} */
        var test = rList.exec( t );
        if ( !!test ){
          return Combinator.elements( GenerateRefference[ test[ 1 ] ] );
        }
        return GenerateRefference[ t ];
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
    }
  };
})();

arbitrary.fn.init.prototype = arbitrary.fn;

