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
            listOf = combinator.listOf,
            type_expr, ref;
        if ( !!test ){
          type_expr = test[ 1 ];
          ref = generateReference[ type_expr ];
          return listOf( ref );
        }
        ref = generateReference[ t ];
        return ref;
      },
      _register_adhoc = function( adhoc_type, generator ){
        return generateReference.register( adhoc_type, generator );
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
    recipe: function( generator ){
      if ( this.length === 1 && generator.constructor === arbitrary ){
        generateReference.register( this.types[ 0 ], generateReference[ generator.types ] );
      }
      // FIXME adhock implementation
      if ( this.length === 1 && typeof generator === 'function' ){
        generateReference.register( this.types[0], generator );
        return;
      }
      if ( arguments.length === 1 && typeof arguments === 'object' ){
        generateReference.register( arguments[ 0 ] );
      }
    },
    fmap: function( addtional ){
      var generators = map( selectGenerator, this.types ),
          adhoc = function( progress ){
            var values = map( function _apply_progress( generator ){
                                return generator( progress );
                              },
                              generators );

            return addtional.apply( null, values );
          },
          new_type = 'adhock_' + ( addtional.name || whatTimeIsNow() ) +
                      '_(' + this.types.join(', ') + ')';
      _register_adhoc( new_type, adhoc );
      return arbitrary.call( null, new_type );
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
          index = 0,
          generators,
          values,
          result = [];
      try {
        generators = map( selectGenerator, this.types );
      } catch ( e ){
        if ( console && console.log ){
          console.log( e );
        }
      }
      for ( ; index < count; index++ ){
        values = map( function( g ){ return g( index ); },
                      generators );
        if ( console && console.log ){
          console.log( values.length === 1 ? values[ 0 ] : values );
        }
        result.push( values );
      }
      return result;
    }
  };
})();

arbitrary.fn.init.prototype = arbitrary.fn;

