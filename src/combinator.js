
/** @constructor */
function Combinator(){}

/** @type {Combinator} */
var combinator = new Combinator();
/**
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.sized = function( generator ){
  var _grow = seed.exponent( 2, 0.5 );
  return function _generate_by_size( progress ){
    var v_ = _grow( progress ),
        v = generator( v_ );
    return v;
  };
};
/**
 * @param {function(number):number} grow
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.resize = function( grow, generator ){
  return function _generate_with_resize( progress ){
    var v_ = grow( progress ),
        v = generator( v_ );
    return v;
  };
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.choose = function( n1, n2 ){
  var n_min = Math.min( n1, n2 ),
      n_max = Math.max( n1, n2 ),
      value,
      _generate_num = function(){
        value = Math.random() * ( n_max - n_min + 1 ) + n_min;
        return value;
      },
      _generate_int = function(){
        value = Math.floor( Math.random() * ( n_max - n_min + 1)) + n_min;
        return value;
      };
  if ( Math.floor( n1 ) === n1 &&  Math.floor( n2 ) === n2 ) { // arguments is Integer
    return _generate_int;
  }
  return _generate_num;
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.chooseNow = function( n1, n2 ){
  var n_min = Math.min( n1, n2 ),
      n_max = Math.max( n1, n2 ),
      value;
  if ( Math.floor( n1 ) === n1 && Math.floor( n2 ) === n2 ){
    value = Math.floor( Math.random() * ( n_max - n_min + 1 ) ) + n_min;
    return value;
  }
  value = Math.random() * ( n_max - n_min + 1 ) + n_min;
  return value;
};
/**
 * @param {!Array} list
 * @return {function():*}
 */
combinator.elements = function( list ){
  var max = list.length - 1,
      _select = combinator.choose( 0, max );
  return function _generate_by_list(){
    var index = _select();
    return list[ index ];
  };
};
/**
 * @param {Array.<function():*>} generators
 * @return {function():*}
 */
combinator.oneOf = function( generators ){
  var max = generators.length - 1,
      _select = combinator.choose( 0, max );
  return function _generate_by_one_of_generators( progress ){
    var index = select(),
        value = generators[ index ]( progress );
    return value;
  };
};
/**
 * @param {function():*} generator
 * @param {(function(Array):*)=} opt_callback
 * @return {function(number):Array}
 */
combinator.listOf = function( generator, opt_callback ){
  var _generate_array = function( progress ){
        var index = 0,
            length = Math.random() * progress,
            result = [];
        for ( ; index < length; index++ ){
          result[ index ] = generator( progress );
        }
        return result;
      },
      _generate_array_with_option = function( progress ){
        return opt_callback( _generate_array( progress ) );
      };
  if ( opt_callback === undefined ){
    return _generate_array;
  }
  return _generate_array_with_option;
};
/**
 * @param {function():*} generator
 * @return {function(number):Array}
 */
combinator.listOf1 = function( generator ){
  var _generate_non_empty_array = function( progress ){
    var index = 0;
        l_ = Math.random() * progress;
        length = l_ < 1 ? 1 : l_;
        result = [];
    for ( ; index < length; index++ ){
      result[ index ] = generator( progress );
    }
    return result;
  };
  return _generate_non_empty_array;
};
/**
 * @param {number} length
 * @param {function():*} generator
 * @return {function():Array}
 */
combinator.vectorOf = function( length, generator ){
  var _generate_fixed_length_array = function(){
    var index = 0,
        list = [];
    for ( ; index < length; index++ ){
      list[ index ] = generator();
    }
    return list;
  };
  return _generate_fixed_length_array;
};
/**
 * @param {Array.<Tuple>} rate_generators
 * @param {(function(*):*)=} opt_callback
 * @return {function(number=):*}
 */
combinator.frequency = function( rated_generators, opt_callback ){
  var rate_list = map( function _collect_rate ( x ){ return x.fst; },
                       rated_generators ),
      generators = map( function _collect_generator ( x ){ return x.snd; },
                        rated_generators ),
      sum = sumOf( rate_list ),
      select = combinator.choose( 1, sum ),
      _generate_by_frequency = function( progress ){
        var index = 0,
            threshold = select(),
            rate = 1,
            value;
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
      _generate_by_frequency_with_option = function( progress ){
        return opt_callback( _generate_by_frequency( progress ) );
      };
  if ( opt_callback === undefined ){
    return _generate_by_frequency;
  }
  return _generate_by_frequency_with_option;
};

