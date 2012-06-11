
/**
 * @param {number} x
 * @return {number}
 */
var random = function( x ){
  return Math.round( Math.random() * x );
};

var Seed = (function(){
  var Seed = function(){},
      value = 1,
      instance;

  createSingleton( Seed, {
    getRange: function(){
      var mx = Math.pow( 2, ( Math.round( value / 1.5 )) );
      return random( mx );
    },
    linear: function( opt_a, opt_b ){
      var a = supplement( opt_a, 1, SupplementMode.MAX ),
          b = supplement( opt_b, 0 ),
          mx = a * value + b;
      return random( mx );
    },
    quadratic: function( opt_a, opt_b, opt_c ){
      var a = supplement( opt_a, 1 ),
          b = supplement( opt_b, 0 ),
          c = supplement( opt_c, 0 ),
          mx = a * value * value + b * value + c;
      return random( mx );
    },
    exponent: function( opt_a, opt_b ){
      var a = supplement( opt_a, 2, SupplementMode.MAX ),
          b = supplement( opt_b, 1 ),
          mx = Math.pow( a, ( Math.round( value * b )));
      return random( mx );
    },
    logarithm: function( opt_a, opt_b, opt_c ){
      var a = supplement( opt_a, 1 ),
          b = supplement( opt_b, 2, SupplementMode.MAX ),
          c = supplement( opt_c, 0 ),
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

