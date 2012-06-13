
/** @type {Combinator} */
var combinator = (function( seed ){
  /** @constructor */
  var Combinator = function(){};

  /** @type Combinator */
  var combinator = new Combinator();

  /**
   * @param {function(number):Object} generator
   * @return {function(number):Object}
   */
  combinator.sized = function( generator ){
    /**
     * @param {number=} opt_n
     * @return {Object}
     */
    var generate = function( opt_n ){
      /** @type {number} */
      var n = supplement( seed.exponent( 2, 2 / 3 ), opt_n );
      return generator( n );
    };
    return generate;
  };

  /**
   * @param {number} size
   * @param {function(number):Object} generator
   * @return {function():Object}
   */
  combinator.resize = function( size, generator ){
    /**
     * @return {Object}
     */
    var generate = function(){
      return generator( size );
    };
    return generate;
  };

  /**
   * @param {number} low
   * @param {number} high
   * @return {function():number}
   */
  combinator.choose = function( low, high ){
    /**
     * @return {number}
     */
    var generate = function(){
      /** @type {number} */
      var l = Math.random() * low;
      /** @type {number} */
      var h = Math.random() * high;
      /** @type {number} */
      var i = l + h;
      /** @type {number} */
      var r = Math.min( high, Math.max( low, i ));

      return r;
    };

    return generate;
  };

  /**
   * @param {!Array} list
   * @return {function():Object}
   */
  combinator.elements = function( list ){
    /**
     * @return {Object}
     */
    var generate = function(){
      /** @type {number} */
      var index = Math.round( combinator.choose( 0, list.length - 1 )() );
      /** @type {Object} */
      var item = list[ index ];
      return item;
    };

    return generate;
  };

  /**
   * @param {Array.<function():Object>} generators
   * @return {function():Object}
   */
  combinator.oneOf = function( generators ){
    /**
     * @type {function():Object}
     */
    var generate = this.elements( generators );
    return generate;
  };

  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf = function( generator ){
    /**
     * @param {number} n
     * @return {Array}
     */
    var generateBySize = function( n ){
      /** @type {Array} */
      var list = combinator.vectorOf( n, generator )();
      return list;
    };

    var generate = function(){
      /** @type {number} */
      var size = seed.linear( 2 );
      return combinator.resize( size, generateBySize )();
    };

    return generate;
  };

  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf1 = function( generator ){
    /**
     * @param {number} n
     * @return {Array}
     */
    var generateBySize = function( n ){
      /** @type {Array.<Object>} */
      var list = combinator.vectorOf( n, generator )();
      return list;
    };

    var generate = function(){
      /** @type {number} */
      var size = seed.linear( 2, 1 );
      return combinator.resize( size, generateBySize )();
    };

    return generate;
  };

  /**
   * @param {number} length
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.vectorOf = function( length, generator ){
    var generate = function(){
      /** @type {number} */
      var index = 0;
      /** @type {Array} */
      var list = [];

      for ( ; index < length; index++ ){
        list[ index ] = generator();
      }
      return list;
    };

    return generate;
  };

  /**
   * @param {Array.<Array.<(number|function():Object)>>} table
   * @return {function():Object}
   */
  combinator.frequency = function( table ){
    /**
     * @param {Array}
     * @param {number}
     * @return {number}
     */
    var collect = function( x, r ){
      return r + x[ 0 ];
    };
    /** @type {number} */
    var sum = foldLeft( 0, collect, table );
    /** @type {number} */
    var index = 0;
    /** @type {number} */
    var threshold = 1;
    /** @type {number} */
    var length = table.length;

    /**
     * @return {Object}
     */
    var generate = function(){
      threshold = combinator.choose( 1, sum )();

      for ( index = 0; index < length; index++ ){
        if ( threshold < table[ index ][ 0 ] ){
          return table[ index ][ 1 ]();
        }
        threshold -= table[ index ][ 0 ];
      }
      return table[ length - 1 ][ 1 ]();
    };

    return generate;
  };

  return combinator;
})( seed );

