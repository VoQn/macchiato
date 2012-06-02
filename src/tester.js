var Checker = (function(){
  var Checker = function(){}
    , args = []
    , passed = false
    , skipped = false
    , marks = {
        skipped: '\u2662'
      , passed: '\u2713'
      , faild: '\u2718'
    }
    , currentLog
    , name
    , method;
  
  method = {
    getArgs: function(){
      return args;
    },
    isPassed: function(){
      return passed;
    },
    isSkipped: function(){
      return skipped;
    },
    run: function( test, onVerbose, score ){
      var that = this, result = test();
      args = result.arguments;
      if ( !!result.wasSkipped ) {
          skipped = result.wasSkipped;
      } else {
        skipped = false;
        passed = result;
      }
      that.log( onVerbose, score );
    },
    lastResult: function(){
      return currentLog;
    },
    log: function( verbose, score ){
      var kind
        , shouldView = false;
      if ( skipped ) {
        kind = 'skipped'
        score.countUpSkipped();
      } else if ( passed ){
        kind = 'passed'
        score.countUpPassed();
      } else {
        kind = 'faild'
        score.countUpFailure();
        shouldView = true;
      }
      currentLog = marks[ kind ] + " ( " + map( function( a ){
        if ( typeof a == 'string' ){
          return '"' + a + '"';
        }
        return a;
      },args ).join(', ') + ' )';
      if ( verbose || shouldView ){
        //if ( console && console.log ) console.log( currentLog );
      }
    }
  };

  for ( name in method ){
    Checker.prototype[ name ] = method[ name ];
  }

  return new Checker();
})();



