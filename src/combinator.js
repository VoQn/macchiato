
/** @constructor */
var Combinator = function Combinator(){};

/** @type {Combinator} */
var combinator = new Combinator();
/**
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.sized = function( generator ){
  var _grow_ = seed.exponent( 2, 0.5 ),
      _generate_by_size_ = function( progress ){
        var v_ = _grow_( progress ),
            v__ = generator( v_ );
        return v__;
      };
  return _generate_by_size_;
};
/**
 * @param {function(number):number} grow
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.resize = function( grow, generator ){
  var _generate_with_resize_ = function( progress ){
        var v_ = grow( progress ),
            v__ = generator( v_ );
        return v__;
      };
  return _generate_with_resize_;
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.choose = function( n1, n2 ){
  var n_min_ = Math.min( n1, n2 ),
      n_max_ = Math.max( n1, n2 ),
      n_ = n_max_ - n_min_ + 1,
      value_,
      _generate_num_ = function(){
        value_ = Math.random() * n_ + n_min_;
        return value_;
      },
      _generate_int_ = function(){
        value_ = Math.floor( Math.random() * n_ ) + n_min_;
        return value_;
      };
  if ( Math.floor( n1 ) === n1 &&  Math.floor( n2 ) === n2 ) { // arguments is Integer
    return _generate_int_;
  }
  return _generate_num_;
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.chooseNow = function( n1, n2 ){
  var n_min_ = Math.min( n1, n2 ),
      n_max_ = Math.max( n1, n2 ),
      n_ = n_max_ - n_min_ + 1,
      value_;
  if ( Math.floor( n1 ) === n1 && Math.floor( n2 ) === n2 ){
    value_ = Math.floor( Math.random() * n_ ) + n_min_;
    return value_;
  }
  value_ = Math.random() * n_ + n_min_;
  return value_;
};
/**
 * @param {!Array} list
 * @return {function():*}
 */
combinator.elements = function( list ){
  var max_ = list.length - 1,
      _select_ = combinator.choose( 0, max_ ),
      _generate_by_list_ = function(){
        var index_ = _select_();
        return list[ index_ ];
      };
  return _generate_by_list_;
};
/**
 * @param {Array.<function():*>} generators
 * @return {function():*}
 */
combinator.oneOf = function( generators ){
  var max_ = generators.length - 1,
      _select_ = combinator.choose( 0, max_ ),
      _generate_by_one_of_generators_ = function( progress ){
        var index_ = _select_(),
            value_ = generators[ index_ ]( progress );
        return value_;
      };
  return _generate_by_one_of_generators_;
};
/**
 * @param {function():*} generator
 * @param {(function(Array):*)=} opt_callback
 * @return {function(number):Array}
 */
combinator.listOf = function( generator, opt_callback ){
  var _generate_array_ = function( progress ){
        var index_ = 0,
            length_ = Math.random() * progress,
            result_ = [];
        for ( ; index_ < length_; index_++ ){
          result_[ index_ ] = generator( progress );
        }
        return result_;
      },
      _generate_array_with_option_ = function( progress ){
        return opt_callback( _generate_array_( progress ) );
      };
  if ( opt_callback === undefined ){
    return _generate_array_;
  }
  return _generate_array_with_option_;
};
/**
 * @param {function():*} generator
 * @return {function(number):Array}
 */
combinator.listOf1 = function( generator ){
  var _generate_non_empty_array_ = function( progress ){
    var index_ = 0;
        l_ = Math.random() * progress;
        length_ = l_ < 1 ? 1 : l_;
        result_ = [];
    for ( ; index_ < length_; index_++ ){
      result_[ index_ ] = generator( progress );
    }
    return result_;
  };
  return _generate_non_empty_array_;
};
/**
 * @param {number} length
 * @param {function():*} generator
 * @return {function():Array}
 */
combinator.vectorOf = function( length, generator ){
  var _generate_fixed_length_array_ = function(){
    var index_ = 0,
        list_ = [];
    for ( ; index_ < length; index_++ ){
      list_[ index_ ] = generator();
    }
    return list_;
  };
  return _generate_fixed_length_array_;
};
/**
 * @param {Array.<Tuple>} rate_generators
 * @param {(function(*):*)=} opt_callback
 * @return {function(number=):*}
 */
combinator.frequency = function( rated_generators, opt_callback ){
  var rate_list_  = heads( rated_generators ),
      generators_ = tails( rated_generators ),
      sum_        = sumOf( rate_list_ ),
      _select_    = combinator.choose( 1, sum_ ),

      _generate_by_frequency_ = function( progress ){
        var index_ = 0,
            threshold_ = _select_(),
            rate_ = 1,
            value_;
        for ( ; rate_ = rate_list_[ index_ ]; index_++ ){
          if ( threshold_ < rate_ ){
            value_ = generators_[ index_ ]( progress );
            return value_;
          }
          threshold_ -= rate_;
        }
        value_ = generators_[ index_ - 1 ]( progress );
        return value_;
      },
      _generate_by_frequency_with_option_ = function( progress ){
        return opt_callback( _generate_by_frequency_( progress ) );
      };
  if ( opt_callback === undefined ){
    return _generate_by_frequency_;
  }
  return _generate_by_frequency_with_option_;
};

