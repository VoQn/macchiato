
var combinator = (function(){
  /** @constructor */
  var Combinator = function(){},
      /** @type {Combinator} */
      combinator = new Combinator();
  /**
   * @param {function(number):*} generator
   * @return {function(number):*}
   */
  combinator.sized = function( generator ){
    var exponent = seed.exponent,
        generate = function( opt_n ){
          var alt = exponent( 2, 2 / 3 ),
              n = supplement( alt, opt_n );
          return generator( n );
        };
    return generate;
  };
  /**
   * @param {number} size
   * @param {function(number):*} generator
   * @return {function():*}
   */
  combinator.resize = function( size, generator ){
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
    var generate = function(){
      var l = Math.random() * low,
          h = Math.random() * high,
          r = Math.min( high, Math.max( low, l + h ));
      return r;
    };
    return generate;
  };
  /**
   * @param {!Array} list
   * @return {function():Object}
   */
  combinator.elements = function( list ){
    var choose = combinator.choose,
        max = list.length,
        generate = function(){
          var index = ~~choose( 0, max )(),
              item = list[ index ];
          return item;
        };
    return generate;
  };
  /**
   * @param {Array.<function():Object>} generators
   * @return {function():Object}
   */
  combinator.oneOf = function( generators ){
    var elements = combinator.elements,
        generate = elements( generators );
    return generate;
  };
  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf = function( generator ){
    var linear = seed.linear,
        resize = combinator.resize,
        vectorOf = combinator.vectorOf,
        generate = function(){
          var generateBySize = function( n ){
            var list = vectorOf( n, generator )();
            return list;
          };
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
    var linear = seed.linear,
        vectorOf = combinator.vectorOf,
        resize = combinator.resize,
        generate = function(){
          var generateBySize = function( n ){
            var list = vectorOf( n, generator )();
            return list;
          };
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
      var index = 0,
          list = [];
      for ( ; index < length; index++ ){
        list[ index ] = generator();
      }
      return list;
    };
    return generate;
  };
  /**
   * @param {Array.<Tuple>} rate_generators
   * @return {function():Object}
   */
  combinator.frequency = function( rate_generators ){
    var choose = combinator.choose,
        collect = function( x, r ){
          return r + x.fst;
        },
        sum = foldLeft( 0, collect, rate_generators ),
        rate_list_ = map( function( x ){
                              return x.fst;
                          }, rate_generators ),
        generators_ = map( function( x ){
                              return x.snd;
                          }, rate_generators ),
        generate = function(){
          var index = 0,
              rate_list = rate_list_,
              rate,
              generators = generators_,
              threshold = choose( 1, sum )();
          for ( ; rate = rate_list[ index ]; index++ ){
            if ( threshold < rate ){
              return generators[ index ]();
            }
            threshold -= rate;
          }
          return generators[ index - 1 ]();
        };
    return generate;
  };
  return combinator;
})();

