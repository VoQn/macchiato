
var Combinator = (function(){
  var Combinator = function(){}, instance;

  instance = createSingleton( Combinator, {
    sized: function( generateBySize ){
      var generate = function(){
        return generateBySize( Seed.getRange() );
      };
      return generate;
    },
    resize: function( size, generatorBySize ){
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
      generate = that.sized(function( n ){
          var log = Math.LOG10E * Math.log( n ),
              length = Math.round( log ) * 10,
              list = that.vectorOf( length, generator )();
          return list;
      });
      return generate;
    },
    listOf1: function( generator ){
      var that = this, generate;
      generate = that.sized(function( n ){
        var log = Math.LOG10E * Math.log( n ),
            length = Math.ceil( log ) * 10,
            list = that.vectorOf( length, generator )();
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
    }
  });

  return instance;
})();

