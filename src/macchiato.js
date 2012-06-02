var Macchiato = (function(){
  var Macchiato = function(){}
    , name, method
    , suites = []
    , testCount
    , writeMsg
    , writeLog
    , clearLog
    , wrapSpan
    , check;
  writeMsg = function( msg ){
    var board = document.querySelector('#test-control .message');
    board.innerHTML = msg;
  };
  writeLog = function( log, ignore ){
    var consoleLine = document.querySelector('#logger .log-line')
      , str = !!ignore ? log : htmlEscape( log );
    consoleLine.innerHTML += str + '<br>';
  };
  clearLog = function( ){
    var consoleLine = document.querySelector('#logger .log-line');
    consoleLine.innerHTML = '';
  };
  wrapSpan = function( isGreen, msg ){
    var dom = '<span class="';
    dom += ( isGreen ? 'passed' : 'failed' ) + '">';
    dom += msg + '</span>';
    return dom;
  };
  check = function( label, property ){
    var i = 0, allPassed = true, result, msg;
    for ( ; i < testCount; i++ ){
      Checker.run( property, verbose, Score );
      if( verbose ) writeLog( Checker.lastResult() );
      Seed.grow();
    }
    result = Score.evaluate();
    msg = wrapSpan( result.ok, label + ' : ' + result.message );
    allPassed = allPassed && result.ok;
    writeLog( msg, true );
    Score.clear();
    Seed.clear();
  };
  method = {
    stock: function( p ){
      suites.push( p );
    },
    check: function( ){
      var that = this
        , i = 0
        , l = suites.length
        , tests
        , name
        , testLabel
        , areTestsPassedAll = true
        , msg;
      testCount = parseInt( document.getElementById( 'test-count' ).value );
      clearLog();
      for ( ; i < l; i++ ){
        tests = suites[ i ];
        for ( name in tests ){
          check( name, tests[ name ]);
        }
      }
      if ( areTestsPassedAll )
        msg = 'Ok, All tests succeeded!!';
      else
        msg = 'Oops! failed test exist...';
      writeMsg( msg );
    }
  };
  
  for ( name in method ){
    Macchiato.prototype[ name ] = method[ name ];
  }

  return new Macchiato();
})();