
var Combinator = (function(){
  var Combinator = function(){}, instance;

  createSingleton( Combinator, {
    sized: function( generateBySize ){
      var generate = function( opt_n ){
        var n = supplement( opt_n, Seed.exponent( 2, 2 / 3 ) );
        return generateBySize( n );
      };
      return generate;
    },
    resize: function( size, generateBySize ){
      var generate = function(){
        return generateBySize( size );
      };
      return generate;
    },
    choose: function( low, high ){
      var generate = function(){
        var l = Math.random() * low,
            h = Math.random() * high,
            i = l + h,
            r = Math.min( high, Math.max( low, i ));
        return i;
      };
      return generate;
    },
    elements: function( list ){
      var that = this, generate;
      generate = function(){
        var index = Math.round( that.choose( 0, list.length - 1 )() ),
            item = list[ index ];
        return item;
      };
      return generate;
    },
    oneOf: function( generators ){
      var generate = this.elements( generators );
      return generate;
    },
    listOf: function( generator ){
      var that = this, generate;
      generate = that.resize( Seed.linear( 2 ), function( n ){
        var list = that.vectorOf( n, generator )();
        return list;
      });
      return generate;
    },
    listOf1: function( generator ){
      var that = this, generate;
      generate = that.resize( Seed.linear( 2, 1 ), function( n ){
        var list = that.vectorOf( n, generator )();
        return list;
      });
      return generate;
    },
    vectorOf: function( length, generator ){
      var generate = function(){
        var i = 0,
            list = [];
        for ( ; i < length; i++ ){
          list[ i ] = generator();
        }
        return list;
      };
      return generate;
    },
    frequency: function( freq ){
      var that = this,
          generate,
          sum = 0,
          i = 0,
          n = 1,
          l = freq.length;

      for ( ; i < l; i++ ){
          sum += freq[ i ][ 0 ];
        }

        i = 0;

      generate = function(){
        n = that.choose( 1, sum )();

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
  });

  return new Combinator();
})();

