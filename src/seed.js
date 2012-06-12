
/**
 * @param {number} x
 * @return {number}
 */
var random = function( x ){
  return Math.round( Math.random() * x );
};

var seed = (function(){
  var Seed = function(){},
      value = 1,
      instance;

  createSingleton( Seed, {
    getRange: function(){
      var mx = Math.pow( 2, ( Math.round( value / 1.5 )) );
      return random( mx );
    },
    linear: function( opt_a, opt_b ){
      var a = supplement( 1, opt_a, Math.max ),
          b = supplement( 0, opt_b ),
          mx = a * value + b;
      return random( mx );
    },
    quadratic: function( opt_a, opt_b, opt_c ){
      var a = supplement( 1, opt_a ),
          b = supplement( 0, opt_b ),
          c = supplement( 0, opt_c ),
          mx = a * value * value + b * value + c;
      return random( mx );
    },
    exponent: function( opt_a, opt_b ){
      var a = supplement( 2, opt_a, Math.max ),
          b = supplement( 1, opt_b ),
          mx = Math.pow( a, ( Math.round( value * b )));
      return random( mx );
    },
    logarithm: function( opt_a, opt_b, opt_c ){
      var a = supplement( 1, opt_a ),
          b = supplement( 2, opt_b, Math.max ),
          c = supplement( 0, opt_c ),
          mx = Math.log( value * a ) / Math.log( b ) + c;
      return random( mx );
    },
    grow: function(){
      value++;
      return value;
    },
    clear: function(){
      value = 1;
    }
  });
  return new Seed();
})();

