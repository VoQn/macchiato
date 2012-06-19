
/** @constructor */
var Combinator = function(){};
/** @type {Combinator} */
var combinator = new Combinator();
/**
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.sized = function( generator ){
  var grow = seed.exponent( 2, 0.5 ),
      generate = function( progress ){
        var v_ = grow( progress ),
            v = generator( v_ );
        return v;
      };
  return generate;
};
/**
 * @param {function(number):number} grow
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.resize = function( grow, generator ){
  var generate = function( progress ){
    var v_ = grow( progress ),
        v = generator( v_ );
    return v;
  };
  return generate;
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.choose = function( n1, n2 ){
  var nMin = Math.min( n1, n2 ),
      nMax = Math.max( n1, n2 ),
      value,
      generate = function(){
        value = Math.random() * ( nMax - nMin + 1 ) + nMin;
        return value;
      },
      generateInt = function(){
        value = Math.floor( Math.random() * ( nMax - nMin + 1)) + nMin;
        return value;
      };
  if ( Math.floor( n1 ) === n1 &&  Math.floor( n2 ) === n2 ) { // arguments is Integer
    return generateInt;
  }
  return generate;
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.chooseNow = function( n1, n2 ){
  var nMin = Math.min( n1, n2 ),
      nMax = Math.max( n1, n2 ),
      value;
  if ( Math.floor( n1 ) === n1 && Math.floor( n2 ) === n2 ){
    value = Math.floor( Math.random() * ( nMax - nMin + 1 ) ) + nMin;
    return value;
  }
  value = Math.random() * ( nMax - nMin + 1 ) + nMin;
  return value;
};
/**
 * @param {!Array} list
 * @return {function():*}
 */
combinator.elements = function( list ){
  var max = list.length - 1,
      select = combinator.choose( 0, max ),
      generate = function(){
        var index = select();
        return list[ index ];
      };
  return generate;
};
/**
 * @param {Array.<function():*>} generators
 * @return {function():*}
 */
combinator.oneOf = function( generators ){
  var max = generators.length - 1,
      select = combinator.choose( 0, max ),
      generate = function( progress ){
        var index = select(),
            value = generators[ index ]( progress );
        return value;
      };
  return generate;
};
/**
 * @param {function():*} generator
 * @param {(function(Array):*)=} opt_callback
 * @return {function(number):Array}
 */
combinator.listOf = function( generator, opt_callback ){
  var index = 0,
      length = 0,
      result = [],
      generate = function( progress ){
        index = 0;
        length = Math.random() * progress;
        result = [];
        for ( ; index < length; index++ ){
          result[ index ] = generator( progress );
        }
        return result;
      },
      generateWithOption = function( progress ){
        index = 0;
        length = Math.random() * progress;
        result = [];
        for ( ; index < length; index++ ){
          result[ index ] = generator( progress );
        }
        result = opt_callback( result );
        return result;
      };
  if ( opt_callback === undefined ){
    return generate;
  }
  return generateWithOption;
};
/**
 * @param {function():*} generator
 * @return {function(number):Array}
 */
combinator.listOf1 = function( generator ){
  var generate = function( progress ){
    var index = 0;
        l_ = Math.random() * progress;
        length = l_ < 1 ? 1 : l_;
        result = [];
    for ( ; index < length; index++ ){
      result[ index ] = generator( progress );
    }
    return result;
  };
  return generate;
};
/**
 * @param {number} length
 * @param {function():*} generator
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
 * @param {(function(*):*)=} opt_callback
 * @return {function(number=):*}
 */
combinator.frequency = function( rated_generators, opt_callback ){
  var rate_list = map( function( x ){ return x.fst; },
                       rated_generators ),
      generators = map( function( x ){ return x.snd; },
                        rated_generators ),
      sum = sumOf( rate_list ),
      select = combinator.choose( 1, sum ),
      index = 0,
      threshold = 1,
      rate = 1,
      generate = function( progress ){
        index = 0;
        threshold = select();
        var value;
        for ( ; rate = rate_list[ index ]; index++ ){
          if ( threshold < rate ){
            value = generators[ index ]( progress );
            return value;
          }
          threshold -= rate;
        }
        value = generators[ index - 1 ]( progress );
        return value;
      },
      generateWithOption = function( progress ){
        index = 0;
        threshold = select();
        var value;
        for ( ; rate = rate_list[ index ]; index++ ){
          if ( threshold < rate ){
            value = generators[ index ]( progress );
            return opt_callback( value );
          }
          threshold -= rate;
        }
        value = generators[ index - 1 ]( progress );
        return opt_callback( value );
      };
  if ( opt_callback === undefined ){
    return generate;
  }
  return generateWithOption;
};

