
var Combinator = (function(){
  /** @constructor */
  var Combinator = function(){},
  /** prototype */
  method = {
      /**
       * @param {function(number):Object} generator
       * @return {function(number):Object}
       */
    sized: function( generator ){
      /**
       * @param {number=} opt_n
       * @return {Object}
       */
      var generate = function( opt_n ){
        /** @type {number} */
        var n = supplement( Seed.exponent( 2, 2 / 3 ), opt_n );
        return generator( n );
      };
      return generate;
    },
    /**
     * @param {number} size
     * @param {function(number):Object} generator
     * @return {function():Object}
     */
    resize: function( size, generator ){
      /**
       * @return {Object}
       */
      var generate = function(){
        return generator( size );
      };
      return generate;
    },
    /**
     * @param {number} low
     * @param {number} high
     * @return {function():number}
     */
    choose: function( low, high ){
      /**
       * @return {number}
       */
      var generate = function(){
        /** @type {number} */
        var l = Math.random() * low,
            /** @type {number} */
            h = Math.random() * high,
            /** @type {number} */
            i = l + h,
            /** @type {number} */
            r = Math.min( high, Math.max( low, i ));
        return i;
      };
      return generate;
    },
    /**
     * @param {Array.<Object>} list
     * @return {function():Object}
     */
    elements: function( list ){
      /**
       * @return {Object}
       */
      var generate = function(){
        /** @type {number} */
        var index = Math.round( method.choose( 0, list.length - 1 )() ),
            /** @type {Object} */
            item = list[ index ];
        return item;
      };
      return generate;
    },
    /**
     * @param {Array.<function():Object>} generators
     * @return {function():Object}
     */
    oneOf: function( generators ){
      var generate = this.elements( generators );
      return generate;
    },
    /**
     * @param {function():Object} generator
     * @return {function():Array.<Object>}
     */
    listOf: function( generator ){
      var generate = method.resize( Seed.linear( 2 ), function( n ){
        /** @type {Array.<Object>} */
        var list = method.vectorOf( n, generator )();
        return list;
      });
      return generate;
    },
    /**
     * @param {function():Object} generator
     * @return {function():Array.<Object>
     */
    listOf1: function( generator ){
      var generate = method.resize( Seed.linear( 2, 1 ), function( n ){
        /** @type {Array.<Object>} */
        var list = method.vectorOf( n, generator )();
        return list;
      });
      return generate;
    },
    /**
     * @param {number} length
     * @param {function():Object} generator
     * @return {function():Array.<Object>}
     */
    vectorOf: function( length, generator ){
      var generate = function(){
        /** @type {number} */
        var i = 0,
            /** @type {Array.<Object>} */
            list = [];
        for ( ; i < length; i++ ){
          list[ i ] = generator();
        }
        return list;
      };
      return generate;
    },
    /**
     * @param {Array.<Array.<(number|function():Object)>>} freq
     * @return {function():Object}
     */
    frequency: function( freq ){
      var generate,
          sum = foldLeft( 0, function( x, r ){
            return r + x[ 0 ];
          }, freq ),
          i = 0,
          n = 1,
          l = freq.length;

      generate = function(){
        n = method.choose( 1, sum )();

        for ( ; i < l; i++ ){
          if ( n < freq[ i ][ 0 ] ){
            return freq[ i ][ 1 ]();
          }
          n -= freq[ i ][ 0 ];
        }
        return freq[ l - 1 ][ 1 ]();
      };

      return generate;
    }
  };

  createSingleton( Combinator, method );

  return new Combinator();
})();

