
/** @type {Seed} */
var seed = (function(){
  /** @constructor */
  var Seed = function(){}
  /** @type {number} */
  value = 1;

  /** @type {Seed} */
  var seed = new Seed();

  /**
   * @param {number} x
   * @return {number}
   */
  var random = function( x ){
    return Math.round( Math.random() * x );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @return {number}
   */
  seed.linear = function( opt_a, opt_b ){
    var a = supplement( 1, opt_a, Math.max );
    var b = supplement( 0, opt_b );
    var mx = a * value + b;
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @param {number=} opt_c
   * @return {number}
   */
  seed.quadratic = function( opt_a, opt_b, opt_c ){
    var a = supplement( 1, opt_a );
    var b = supplement( 0, opt_b );
    var c = supplement( 0, opt_c );
    var mx = a * value * value + b * value + c;
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @return {number}
   */
  seed.exponent = function( opt_a, opt_b ){
    var a = supplement( 2, opt_a, Math.max );
    var b = supplement( 1, opt_b );
    var mx = Math.pow( a, ( Math.round( value * b )));
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @param {number=} opt_c
   * @return {number}
   */
  seed.logarithm = function( opt_a, opt_b, opt_c ){
    var a = supplement( 1, opt_a );
    var b = supplement( 2, opt_b, Math.max );
    var c = supplement( 0, opt_c );
    var mx = Math.log( value * a ) / Math.log( b ) + c;
    return random( mx );
  };

  /**
   * @return {number}
   */
  seed.grow = function(){
    value++;
    return value;
  };

  seed.clear = function(){
    value = 1;
  };

  return seed;
})();

