
var TestView = (function(){
  var TestView = function(){},
      for_web,
      instance;

  for_web = {
    getTestCount: function(){
      return parseInt( document.getElementById( 'test-count' ).value, 10 );
    },
    writeMsg: function( msg ){
      var board = document.querySelector( '#test-control .message' ),
          textNode = document.createTextNode( msg );
      board.appendChild( textNode );
    },
    clearMsg: function( ){
      var board = document.querySelector( '#test-control .message' );
      clearNode( board );
    },
    putLog: function( log, withEscape ){
      var consoleLine = document.querySelector( '#logger .log-line' ),
          br = document.createElement('br');
      if ( log instanceof HTMLElement ){
        consoleLine.appendChild( log );
      } else {
        var str = !withEscape ? log : htmlEscape( log ),
            textNode = document.createTextNode( str );
        consoleLine.appendChild( textNode );
      }
      consoleLine.appendChild( br );
    },
    clearLog: function( ){
      var consoleLine = document.querySelector( '#logger .log-line' );
      clearNode( consoleLine );
    },
    highlightMsg: function( isGreen, msg, placeholder ){
      var dom = document.createElement( 'span' ),
          textNode = document.createTextNode( msg );
      dom.setAttribute('class', ( isGreen ? 'passed' : 'failed' ));
      dom.appendChild( textNode );
      return dom;
    }
  };

  instance = createSingleton( TestView, for_web );

  return instance;
})();

var Macchiato = (function(){
  var Macchiato = function(){}, view = TestView, instance, suites = [], check;

  check = function( label, property ){
    var i = 0, l = view.getTestCount(), allPassed = true, result, msg;
    while ( i++ < l ){
      Checker.run( property, verbose, Score );
      if( verbose ) view.putLog( Checker.lastResult() );
      Seed.grow();
    }
    result = Score.evaluate();
    msg = view.highlightMsg( result.ok, label + ' : ' + result.message );
    allPassed = allPassed && result.ok;
    view.putLog( msg );
    Score.clear();
    Seed.clear();
    return allPassed;
  };

  instance = createSingleton( Macchiato, {
    stock: function( p ){
      suites.push( p );
    },
    check: function( ){
      var passed = true, msg;
      view.clearMsg();
      view.clearLog();

      each( function( tests ){
        each( function( test, label ){
          passed = passed && check( label, test );
        }, tests );
      }, suites );

      msg = passed ? 'Ok, All tests succeeded!!' : 'Oops! failed test exist...';
      view.writeMsg( msg );
    }
  });

  return instance;

})();
