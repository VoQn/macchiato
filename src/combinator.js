
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
    var alt, n;
    return function( opt_n ){
      alt = seed.exponent( 2, 2 / 3 );
      n = supplement( alt, opt_n );
      return generator( n );
    };
  };
  /**
   * @param {number} size
   * @param {function(number):*} generator
   * @return {function():*}
   */
  combinator.resize = function( size, generator ){
    return function(){
      return generator( size );
    };
  };
  /**
   * @param {number} low
   * @param {number} high
   * @return {function():number}
   */
  combinator.choose = function( low, high ){
    var l, h;
    return function(){
      l = Math.random() * low;
      h = Math.random() * high;
      return Math.min( high, Math.max( low, l + h ));
    };
  };
  /**
   * @param {!Array} list
   * @return {function():Object}
   */
  combinator.elements = function( list ){
    var choose = combinator.choose,
        max = list.length,
        index = 0;
    return function(){
      index = ~~choose( 0, max )();
      return list[ index ];
    };
  };
  /**
   * @param {Array.<function():Object>} generators
   * @return {function():Object}
   */
  combinator.oneOf = function( generators ){
    var generate = combinator.elements( generators );
    return function(){
      return generate()();
    };
  };
  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf = function( generator ){
    var linear = seed.linear,
        resize = combinator.resize,
        vectorOf = combinator.vectorOf,
        generateBySize = function( n ){
          return vectorOf( n, generator )();
        };
    return function(){
       return resize( linear( 2 ), generateBySize )();
    };
  };
  /**
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.listOf1 = function( generator ){
    var linear = seed.linear,
        vectorOf = combinator.vectorOf,
        resize = combinator.resize,
        generateBySize = function( n ){
          return vectorOf( n, generator )();
        };
    return function(){
      return resize( linear( 2, 1 ), generateBySize )();
    };
  };
  /**
   * @param {number} length
   * @param {function():Object} generator
   * @return {function():Array}
   */
  combinator.vectorOf = function( length, generator ){
    var index = 0,
        list = [];
    return function(){
      for ( index = 0, list = []; index < length; index++ ){
        list[ index ] = generator();
      }
      return list;
    };
  };
  /**
   * @param {Array.<Tuple>} rate_generators
   * @return {function():Object}
   */
  combinator.frequency = function( rate_generators ){
    var choose = combinator.choose,
        rate_list = map( function( x ){ return x.fst; },
                         rate_generators ),
        generators = map( function( x ){ return x.snd; },
                          rate_generators ),
        sum = sumOf( rate_list ),
        index = 0,
        rate,
        threshold;
    return function(){
      threshold = choose( 1, sum )();
      for ( index = 0; rate = rate_list[ index ]; index++ ){
        if ( threshold < rate ){
          return generators[ index ]();
        }
        threshold -= rate;
      }
      return generators[ index - 1 ]();
    };
  };
  return combinator;
})();

