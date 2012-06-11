
var ViewInterface = new Interface('ViewInterface', [
    'getTestCount',
    'clear',
    'putMsg',
    'putLog',
    'dump',
    'highlight'
    ]);

var View = function(){};

var createView = function( stub ){
  var view = new View(),
      name = '';
  for ( name in stub ){
    view[ name ] = stub[ name ];
  }
  Interface.ensureImplements( view, ViewInterface );
  return view;
};

var consoleView = (function(){
  var _log = '';
  return createView({
  getTestCount: function(){
    return 100;
  },
  clear: function(){
    if ( console.clear ){ // for firebug ( Firefox extension )
      console.clear();
    }
    _log = '';
  },
  putMsg: function( msg ){
    console.log( msg );
  },
  putLog: function( msg, withEscape ){
    _log += msg + '\n';
    // console.log( msg );
  },
  dump: function(){
    if ( _log.length > 0 ){
      console.log( _log );
    }
  },
  highlight: function( isGreen, msg ){
    return msg;
  }
});
})();

var htmlView = (function(){
  var _log = '';
  return createView({
  selectors:{
    counter_id: 'test-count',
    messenger_id: 'test-message',
    logger_id: 'test-log'
  },
  setSelectors: function( identifers ){
    var members = this.selectors,
        name = '';
    for ( name in members ){
      if ( identifers[ name ] === undefined ){
        throw new Error('html-test-view need selector id :' + name + ', but undefined');
      }
      this.selectors[ name ] = identifers[ name ];
    }
    return this;
  },
  getTestCount: function(){
    return parseInt( document.getElementById( this.selectors.counter_id ).value, 10 );
  },
  clear: function(){
    var board = document.getElementById( this.selectors.messenger_id ),
        consoleLine = document.getElementById( this.selectors.logger_id );
    _log = '';
    board.innerHTML = '';
    consoleLine.innerHTML = '';
  },
  putMsg: function( msg ){
    var board = document.getElementById( this.selectors.messenger_id );
    board.innerHTML += msg;
  },
  putLog: function( log, withEscape ){
    _log += ( !withEscape ? log : htmlEscape( log ) ) + '<br>';
    /*
    var consoleLine = document.getElementById( this.selectors.logger_id ),
        str = !withEscape ? log : htmlEscape( log );
    consoleLine.innerHTML += str + '<br>';
    */
  },
  dump: function(){
    var consoleLine = document.getElementById( this.selectors.logger_id );
    consoleLine.innerHTML = _log;
  },
  highlight: function( isGreen, msg ){
    return '<span class="' + ( isGreen ? 'passed' : 'failed' ) + '">' + msg + '</span>';
  }
});
})();


