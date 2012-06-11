
var Seed = (function(){
  var Seed = function(){},
      value = 1,
      instance;

  createSingleton( Seed, {
    getRange: function(){
      var mx = Math.pow( 2, ( Math.round( value / 1.5 )) );
      return Math.round( Math.random() * mx );
    },
    linear: function( _a, _b ){
      var a = _a || 1,
          b = _b || 0,
          mx = a * value + b;
      return Math.round( Math.random() * mx );
    },
    quadratic: function( opt_a, opt_b, opt_c ){
      var a = opt_a !== undefined ? opt_a : 1,
          b = opt_b !== undefined ? opt_b : 0,
          c = opt_c !== undefined ? opt_c : 0,
          mx = a * value * value + b * value + c;
      return Math.round( Math.random() + mx );
    },
    exponent: function( opt_a, opt_b ){
      var a = opt_a !== undefined ? Math.max( opt_a, 2 ) : 2,
          b = opt_b !== undefined ? opt_b : 1,
          mx = Math.pow( a, ( Math.round( value * b )));
      return Math.round( Math.random() * mx );
    },
    logarithm: function( opt_a, opt_b, opt_c ){
      var a = opt_a !== undefined ? opt_a : 1,
          b = opt_b !== undefined ? Math.max( opt_b, 2 ) : 2,
          c = opt_c !== undefined ? opt_c : 0,
          mx = Math.log( value * a ) / Math.log( b ) + c;
      return Math.round( Math.random() * mx );
    },
    grow: function(){
      value++;
    },
    clear: function(){
      value = 1;
    }
  });
  return new Seed();
})();

