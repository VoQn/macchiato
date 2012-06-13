
var combinator = (function( seed ){
  /** @constructor */
  var Combinator = function(){};

  /**
   * @param {function(number):Object} generator
   * @return {function(number):Object}
   */
  Combinator.prototype.sized = function( generator ){
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
  Combinator.prototype.resize = function( size, generator ){
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
  Combinator.prototype.choose = function( low, high ){
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
   * @param {Array.<Object>} list
   * @return {function():Object}
   */
  Combinator.prototype.elements = function( list ){
    /**
     * @return {Object}
     */
    var generate = function(){
      /** @type {number} */
      var index = Math.round( Combinator.prototype.choose( 0, list.length - 1 )() );
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
  Combinator.prototype.oneOf = function( generators ){
    var generate = this.elements( generators );
    return generate;
  };

  /**
   * @param {function():Object} generator
   * @return {function():Array.<Object>}
   */
  Combinator.prototype.listOf = function( generator ){
    var generate = Combinator.prototype.resize( seed.linear( 2 ), function( n ){
      /** @type {Array.<Object>} */
      var list = Combinator.prototype.vectorOf( n, generator )();
      return list;
    });
    return generate;
  };

  /**
   * @param {function():Object} generator
   * @return {function():Array.<Object>
   */
  Combinator.prototype.listOf1 = function( generator ){
    var generate = Combinator.prototype.resize( seed.linear( 2, 1 ), function( n ){
      /** @type {Array.<Object>} */
      var list = Combinator.prototype.vectorOf( n, generator )();
      return list;
    });
    return generate;
  };

  /**
   * @param {number} length
   * @param {function():Object} generator
   * @return {function():Array.<Object>}
   */
  Combinator.prototype.vectorOf = function( length, generator ){
    var generate = function(){
      /** @type {number} */
      var index = 0;
      /** @type {Array.<Object>} */
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
  Combinator.prototype.frequency = function( table ){
    var collect = function( x, r ){ return r + x[ 0 ]; };
    var sum = foldLeft( 0, collect, table );
    var index = 0;
    var threshold = 1;
    var length = table.length;

    var generate = function(){
      threshold = Combinator.prototype.choose( 1, sum )();

      for ( ; index < length; index++ ){
        if ( threshold < table[ index ][ 0 ] ){
          return table[ index ][ 1 ]();
        }
        threshold -= table[ index ][ 0 ];
      }
      return table[ length - 1 ][ 1 ]();
    };

    return generate;
  };

  return new Combinator();
})( seed );

