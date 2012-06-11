
var Seed = (function(){
  var Seed = function(){},
      value = 1,
      instance;

  createSingleton( Seed, {
    getRange: function(){
      var mx = Math.pow( 2, ( Math.round( value / 1.5 )) );
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

