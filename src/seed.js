
/** @type {Seed} */
var seed = (function(){
  /** @constructor */
  var Seed = function(){
    /** @type {number} */
    this.value = 1;
  };

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
   * @deprecated
   */
  seed.getRange = function(){
    var mx = Math.pow( 2, ( Math.round( this.value / 1.5 )) );
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @return {number}
   */
  seed.linear = function( opt_a, opt_b ){
    var a = supplement( 1, opt_a, Math.max );
    var b = supplement( 0, opt_b );
    var mx = a * this.value + b;
    return random( mx );
  };

  /**
   * @param {number=} opt_a
   * @param {number=} opt_b
   * @param {number=} opt_c
   * @return {number}
   */
  seed.quadratic = function( opt_a, opt_b, opt_c ){
    var x = this.value;
    var a = supplement( 1, opt_a );
    var b = supplement( 0, opt_b );
    var c = supplement( 0, opt_c );
    var mx = a * x * x + b * x + c;
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
    var mx = Math.pow( a, ( Math.round( this.value * b )));
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
    var mx = Math.log( this.value * a ) / Math.log( b ) + c;
    return random( mx );
  };

  /**
   * @return {number}
   */
  seed.grow = function(){
    this.value = this.value + 1;
    return this.value;
  };

  seed.clear = function(){
    this.value = 1;
  };

  return seed;
})();

