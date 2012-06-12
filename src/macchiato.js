
var Macchiato = (function(){
  var Macchiato = function(){},
      view = consoleView,
      suites = [];

  var check = function( label, property ){
    var i = 0,
        l = view.getTestCount(),
        allPassed = true,
        result;
    for ( ; i < l; i++ ){
      checker.run( property, verbose, score );
      if( view.verbose ) {
        view.putLog( checker.lastResult(), true );
      }
      seed.grow();
    }
    result = score.evaluate();
    view.putLog( view.highlight( result.ok, label + ' : ' + result.message ));
    allPassed = allPassed && result.ok;
    score.clear();
    seed.clear();
    return allPassed;
  };

  createSingleton( Macchiato, {
    setVerbose: function( verbose ){
      view.verbose = verbose;
    },
    setView: function( _view ){
      Interface.ensureImplements( _view, ViewInterface );
      view = _view;
    },
    stock: function( p ){
      suites.push( p );
    },
    taste: function( ){
      var passed = true,
          i = 0,
          l = suites.length,
          label;

      view.clear();

      for ( ; i < l; i++){
        for ( label in suites[ i ] ){
          passed = passed && check( label, suites[ i ][ label ] );
        }
      }

      view.dump();
      view.putMsg( passed ? 'Ok, All tests succeeded!!' : 'Oops! failed test exist...' );
    }
  });

  return new Macchiato();

})();
