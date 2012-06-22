/**
 * @param {string} type_str
 * @param {...string} var_args
 * @constructor
 */
var arbitrary = function( type_str, var_args ){
  var args_ = asArray( arguments );
  return new arbitrary.fn.init( args_ );
};

/**
 * @type {arbitrary}
 */
arbitrary.fn = arbitrary.prototype = (function(){
  var r_list_ = /\[\s?([a-z]+)\s?\]/,
      /**
       * @param {string} t
       * @return {function():Object}
       */
      _select_generator_ = function( type_expr ){
        /** @type {?Array.<string>} */
        var test_ = r_list_.exec( type_expr ),
            _listOf_ = combinator.listOf,
            type_expr_, generator_;
        if ( !!test_ ){
          type_expr_ = test_[ 1 ];
          generator_ = generateReference[ type_expr_ ];
          return _listOf_( generator_ );
        }
        generator_ = generateReference[ type_expr ];
        return generator_;
      },
      _register_adhoc_ = function( adhoc_type, generator ){
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
      var generators_,
          index_ = 0,
          types_ = this.types,
          length_ = types_.length;
      try {
        generators_ = map( _select_generator_, types_ );
      } catch ( e ) {
        if( console && console.log ){
          console.log( e );
        }
      }
      return forAll( generators_, property );
    },
    recipe: function( generator ){
      if ( this.length === 1 && generator.constructor === arbitrary ){
        generateReference.register( this.types[ 0 ],
                                    generateReference[ generator.types ] );
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
    recipeAs: function( new_type_signature ){
      generateReference.register( new_type_signature,
                                  generateReference[ this.types[ 0 ] ] );
      return arbitrary( new_type_signature );
    },
    fmap: function( addtional ){
      var types_ = this.types,
          generators_ = map( _select_generator_, types_ ),
          _apply_progress_,
          _adhoc_ = function( progress ){
            _apply_progress_ = apply( progress );
            var values_ = map( _apply_progress_, generators_ );
            return addtional.apply( null, values_ );
          },
          new_type_ = 'adhock_' + addtional.name + whatTimeIsNow() +
                      '_(' + types_.join(', ') + ')';
      _register_adhoc_( new_type_, _adhoc_ );
      return arbitrary.call( null, new_type_ );
    },
    /**
     * @param {number=} opt_count
     * @return {Array}
     */
    sample: function( opt_count ){
      var fix_ = function( _, o ){
            return Math.max( 1, o );
          },
          count_ = supplement( 10, opt_count, fix_ ),
          types_ = this.types,
          index_ = 0,
          generators_,
          values_,
          result_ = [],
          _apply_progress_;
      try {
        generators_ = map( _select_generator_, types_ );
      } catch ( e ){
        if ( console && console.log ){
          console.log( e );
        }
      }
      for ( ; index_ < count_; index_++ ){
        _apply_progress_ = apply( index_ );
        values_ = map( _apply_progress_, generators_ );
        if ( console && console.log ){
          console.log( values_.length === 1 ? values_[ 0 ] : values_ );
        }
        result_.push( values_ );
      }
      return result_;
    }
  };
})();

arbitrary.fn.init.prototype = arbitrary.fn;

