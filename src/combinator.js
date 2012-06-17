
var combinator = (function(){
  /** @constructor */
  var Combinator = function(){},
      /** @type {Combinator} */
      combinator = new Combinator(),
      randomInt = function( x ){
        return Math.round( Math.random() * x );
      };
  /**
   * @param {function(number):*} generator
   * @return {function(number):*}
   */
  combinator.sized = function( generator ){
    var grow = seed.exponent( 2, 0.5 );
    return function( progress ){
      return generator( grow( progress ) );
    };
  };
  /**
   * @param {function(number):number} grow
   * @param {function(number):*} generator
   * @return {function(number):*}
   */
  combinator.resize = function( grow, generator ){
    return function( progress ){
      return generator( grow( progress ) );
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
      index = Math.round( choose( 0, max )() );
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
   * @return {function(number):Array}
   */
  combinator.listOf = function( generator ){
    var linear = seed.linear( 1 ),
        resize = combinator.resize,
        vectorOf = combinator.vectorOf,
        generateBySize = function( n ){
          return vectorOf( n, generator )();
        };
    return function( progress ){
       return resize( linear, generateBySize )( randomInt( progress ) );
    };
  };
  /**
   * @param {function():Object} generator
   * @return {function(number):Array}
   */
  combinator.listOf1 = function( generator ){
    var linear = seed.linear( 1, 1 ),
        vectorOf = combinator.vectorOf,
        resize = combinator.resize,
        generateBySize = function( n ){
          return vectorOf( n, generator )();
        };
    return function( progress ){
      return resize( linear, generateBySize )( randomInt( progress ) );
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

