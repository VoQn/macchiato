
var TestView = (function(){
  var TestView = function(){},
      for_web,
      instance;

  for_web = {
    selectors:{
      counter_id: 'test-count',
      messenger_id: 'test-message',
      logger_id: 'test-log'
    },
    getTestCount: function(){
      return parseInt( document.getElementById( this.selectors.counter_id ).value, 10 );
    },
    writeMsg: function( msg ){
      var board = document.getElementById( this.selectors.messenger_id );
      board.innerHTML += msg;
    },
    clearMsg: function( ){
      var board = document.getElementById( this.selectors.messenger_id );
      board.innerHTML = '';
    },
    putLog: function( log, withEscape ){
      var consoleLine = document.getElementById( this.selectors.logger_id ),
          str = !withEscape ? log : htmlEscape( log );
      consoleLine.innerHTML += str;
    },
    clearLog: function( ){
      var consoleLine = document.getElementById( this.selectors.logger_id );
      consoleLine.innerHTML = '';
    },
    highlightMsg: function( isGreen, msg ){
      return '<span class="' + ( isGreen ? 'passed' : 'failed' ) + '">' + msg + '</span><br>';
    }
  };

  createSingleton( TestView, for_web );

  return new TestView();
})();

var Macchiato = (function(){
  var Macchiato = function(){},
      view = TestView,
      suites = [];

  var check = function( label, property ){
    var i = 0,
        l = view.getTestCount(),
        allPassed = true,
        result,
        msg = '';
    for ( ; i < l; i++ ){
      Checker.run( property, verbose, Score );
      if( verbose ) {
        msg += Checker.lastResult() + '<br>';
      }
      Seed.grow();
    }
    result = Score.evaluate();
    msg += view.highlightMsg( result.ok, label + ' : ' + result.message );
    allPassed = allPassed && result.ok;
    Score.clear();
    Seed.clear();
    return {
      passed: allPassed,
      message: msg
    };
  };

  createSingleton( Macchiato, {
    stock: function( p ){
      suites.push( p );
    },
    taste: function( ){
      var passed = true,
          i = 0,
          l = suites.length,
          log = '',
          msg = '',
          test,
          label,
          result;

      view.clearMsg();
      view.clearLog();

      for ( ; i < l; i++){
        for ( label in suites[ i ] ){
          test = suites[ i ][ label ];
          result = check( label, test );
          passed = passed && result.passed;
          log += result.message;
        }
      }

      msg = passed ? 'Ok, All tests succeeded!!' : 'Oops! failed test exist...';
      view.putLog( log );
      view.writeMsg( msg );
    }
  });

  return new Macchiato();

})();
