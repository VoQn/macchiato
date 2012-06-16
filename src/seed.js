
var seed = (function(){
  /** @constructor */
  var Seed = function(){},
      seed = new Seed(),
      value = 1,
      /**
       * @param {number} x
       * @return {number}
       */
      random = function( x ){
        return Math.round( Math.random() * x );
      };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @return {number}
   */
  seed.linear = function( opt_a, opt_b ){
    var a = supplement( 1, opt_a, Math.max ),
        b = supplement( 0, opt_b ),
        mx = a * value + b;
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @param {number=} opt_c
   * @return {number}
   */
  seed.quadratic = function( opt_a, opt_b, opt_c ){
    var a = supplement( 1, opt_a ),
        b = supplement( 0, opt_b ),
        c = supplement( 0, opt_c ),
        mx = a * value * value + b * value + c;
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @return {number}
   */
  seed.exponent = function( opt_a, opt_b ){
    var a = supplement( 2, opt_a, Math.max ),
        b = supplement( 1, opt_b ),
        mx = Math.pow( a, ( Math.round( value * b )));
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @param {number=} opt_c
   * @return {number}
   */
  seed.logarithm = function( opt_a, opt_b, opt_c ){
    var a = supplement( 1, opt_a ),
        b = supplement( 2, opt_b, Math.max ),
        c = supplement( 0, opt_c ),
        mx = Math.log( value * a ) / Math.log( b ) + c;
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

