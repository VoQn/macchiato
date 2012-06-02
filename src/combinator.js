var Seed = (function(){
  var Seed = function(){}, value = 1, instance;
  instance = createSingleton( Seed, {
    getRange: function(){
      var mx = Math.pow( 2, ( Math.round( value / 1.5 )) );
      return Math.round( Math.random() * mx );
    },
    grow: function(){
      value++;
    },
    clear: function(){
      value = 0;
    }
  });
  return instance;
})();

var Combinator = (function(){
  var Combinator = function(){}, instance;

  instance = createSingleton( Combinator, {
    sized: function( generateBySize ){
      return function(){
        return generateBySize( Seed.getRange() );
      }
    },
    resize: function( size, generatorBySize ){
      return function(){
        return generateBySize( size );
      }
    },
    choose: function( low, high ){
      return function(){
        var l = Math.random() * low
          , h = Math.random() * high
          , i = l + h
          , r = Math.min( high, Math.max( low, i ));
        return i;
      };
    },
    elements: function( list ){
      var that = this, generate;
      generate = function(){
        var index = Math.round( that.choose( 0, list.length - 1 )() )
          , item = list[ index ];
        return item;
      };
      return generate;
    },
    oneOf: function( generators ){
      var generator = this.elements( generators );
      return generator;
    },
    listOf: function( generator ){
      var that = this;
      return that.sized(function( n ){
          var log = Math.LOG10E * Math.log( n )
            , length = Math.round( log ) * 10
            , list = that.vectorOf( length, generator )();
          return list;
      });
    },
    listOf1: function( generator ){
      var that = this;
      return that.sized(function( n ){
        var log = Math.LOG10E * Math.log( n )
          , length = Math.ceil( log ) * 10
          , list = that.vectorOf( length, generator )();
        return list;
      });
    },
    vectorOf: function( length, generator ){
      return function(){
        var i = 0
          , list = [];
        for ( ; i < length; i++ ){
          list[ i ] = generator();
        }
        return list;
      };
    }
  });

  return instance;
})();
