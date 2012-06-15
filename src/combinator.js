
/** @type {Combinator} */
var combinator = (function(){
  /** @constructor */
  var Combinator = function(){};

  /** @type Combinator */
  var combinator = new Combinator();

  /**
   * @param {function(number):Object} generator
   * @return {function(number):Object}
   */
  combinator.sized = function( generator ){
    var exponent = seed.exponent;

    /**
     * @param {number=} opt_n
     * @return {Object}
     */
    var generate = function( opt_n ){
      /** @type {number} */
      var n = supplement( exponent( 2, 2 / 3 ), opt_n );
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
    var choose = combinator.choose;
    var max = list.length;

    /**
     * @return {Object}
     */
    var generate = function(){
      /** @type {number} */
      var index = ~~choose( 0, max )();
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
    var elements = combinator.elements;
    /**
     * @type {function():Object}
     */
    var generate = elements( generators );
    return generate;
  };

  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf = function( generator ){
    var linear = seed.linear;
    var resize = combinator.resize;
    var vectorOf = combinator.vectorOf;
    var generate = function(){
      /**
       * @param {number} n
       * @return {Array}
       */
      var generateBySize = function( n ){
        /** @type {Array} */
        var list = vectorOf( n, generator )();
        return list;
      };

      /** @type {number} */
      var size = linear( 2 );
      return resize( size, generateBySize )();
    };

    return generate;
  };

  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf1 = function( generator ){
    var linear = seed.linear;
    var vectorOf = combinator.vectorOf;
    var resize = combinator.resize;
    var generate = function(){
      /**
       * @param {number} n
       * @return {Array}
       */
      var generateBySize = function( n ){
        /** @type {Array.<Object>} */
        var list = vectorOf( n, generator )();
        return list;
      };

      /** @type {number} */
      var size = linear( 2, 1 );
      return resize( size, generateBySize )();
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

    var choose = combinator.choose;

    /**
     * @return {Object}
     */
    var generate = function(){
      var index = 0;
      var row;
      var threshold = choose( 1, sum )();

      for ( ; row = table[ index ]; index++ ){
        if ( threshold < row[ 0 ] ){
          return row[ 1 ]();
        }
        threshold -= row[ 0 ];
      }
      return table[ index - 1 ][ 1 ]();
    };

    return generate;
  };

  return combinator;
})();

