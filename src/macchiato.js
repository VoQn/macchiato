var TestView, Macchiato;

TestView = (function(){
  var TestView = function(){}, for_web, instance;

  for_web = {
    getTestCount: function(){
      return parseInt( document.getElementById( 'test-count' ).value );
    },
    writeMsg: function( msg ){
      var board = document.querySelector('#test-control .message');
      board.innerHTML = msg;
    },
    writeLog: function( log, withEscape ){
      var consoleLine = document.querySelector('#logger .log-line'),
          str = !withEscape ? log : htmlEscape( log );
      consoleLine.innerHTML += str + '<br>';
    },
    clearLog: function( ){
      var consoleLine = document.querySelector('#logger .log-line');
      consoleLine.innerHTML = '';
    },
    highlightMsg: function( isGreen, msg ){
      var dom = '<span class="';
      dom += ( isGreen ? 'passed' : 'failed' ) + '">';
      dom += msg + '</span>';
      return dom;
    }
  };

  instance = createSingleton( TestView, for_web );

  return instance;
})();

Macchiato = (function(){
  var Macchiato = function(){}, view = TestView, instance, suites = [], testCount, check;

  check = function( label, property ){
    var i = 0, allPassed = true, result, msg;
    while ( i++ < testCount ){
      Checker.run( property, verbose, Score );
      if( verbose ) view.writeLog( Checker.lastResult() );
      Seed.grow();
    }
    result = Score.evaluate();
    msg = view.highlightMsg( result.ok, label + ' : ' + result.message );
    allPassed = allPassed && result.ok;
    view.writeLog( msg, true );
    Score.clear();
    Seed.clear();
  };

  instance = createSingleton( Macchiato, {
    stock: function( p ){
      suites.push( p );
    },
    check: function( ){
      var that = this, areTestsPassedAll = true,msg;
      testCount = view.getTestCount();
      view.clearLog();

      each( function( tests ){
        each( function( test, label ){
          check( label, test );
        }, tests );
      }, suites );

      msg = areTestsPassedAll ? 'Ok, All tests succeeded!!' : 'Oops! failed test exist...';
      writeMsg( msg );
    }
  });

  return instance;

})();
