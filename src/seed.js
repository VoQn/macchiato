
/** @constructor */
var Seed = function Seed(){};

/** @type {Seed} */
var seed = new Seed();

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @return {function(number):number}
 */
seed.linear = function( opt_a, opt_b ){
  var a_ = supplement( 1, opt_a, Math.max ),
      b_ = supplement( 0, opt_b ),
      _calc_linear_ = function( x ){
        return a_ * x + b_;
      };
  return _calc_linear_;
};
/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @param {number=} opt_c
 * @return {function(number):number}
 */
seed.quadratic = function( opt_a, opt_b, opt_c ){
  var a_ = supplement( 1, opt_a ),
      b_ = supplement( 0, opt_b ),
      c_ = supplement( 0, opt_c );
      _calc_quadratic_ = function( x ){
        return a_ * x * x + b_ * x + c_;
      };
  return _calc_quadratic_;
};

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @return {function(number):number}
 */
seed.exponent = function( opt_a, opt_b ){
  var a_ = supplement( 2, opt_a, Math.max ),
      b_ = supplement( 1, opt_b );
      _calc_exponent_ = function( x ){
        return Math.pow( a_, ( Math.round( x * b_ )));
      };
  return _calc_exponent_;
};

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @param {number=} opt_c
 * @return {function(number):number}
 */
seed.logarithm = function( opt_a, opt_b, opt_c ){
  var a_ = supplement( 1, opt_a ),
      b_ = supplement( 2, opt_b, Math.max ),
      c_ = supplement( 0, opt_c );
      _calc_logarithm_ = function( x ){
        return Math.log( x * a_ ) / Math.log( b_ ) + c_;
      };
  return _calc_logarithm_;
};

