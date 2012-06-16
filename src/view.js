
var ViewInterface = new Interface('ViewInterface', [
    'getTestCount',
    'standby',
    'clean',
    'putMsg',
    'putLog',
    'dump',
    'highlight'
    ]);

/** @constructor */
var View = function(){};

/**
 * @param {Object} stub
 * @return {View}
 */
var createView = function( stub ){
  var view = new View(),
      name = '';
  for ( name in stub ){
    view[ name ] = stub[ name ];
  }
  Interface.ensureImplements( view, ViewInterface );
  return view;
};

/**
 * @type {View}
 */
var consoleView = (function(){
  var _log = '';
  return createView({
  getTestCount: function(){
    return 100;
  },
  standby: function(){
    if ( console.clear ){ // for firebug ( Firefox extension )
      console.clear();
    }
    _log = '';
  },
  clean: function(){
    _log = '';
  },
  putMsg: function( msg ){
    console.log( msg );
  },
  putLog: function( msg, withEscape ){
    _log += msg + '\n';
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

/**
 * @type {View}
 */
var htmlView = (function(){
  var logBuffer = [];
  var i = 0;
  var byId = function( id ){ return document.getElementById( id ); };

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
      return parseInt( byId( this.selectors.counter_id ).value, 10 );
    },
    standby: function(){
      logBuffer = [];
      i = 0;
    },
    clean: function(){
      logBuffer = [];
    },
    putMsg: function( msg ){
      var board = byId( this.selectors.messenger_id );
      board.innerHTML = msg;
    },
    putLog: function( log, withEscape ){
      logBuffer[ i ] = !withEscape ? log : htmlEscape( log );
      i++;
    },
    dump: function(){
      var consoleLine = byId( this.selectors.logger_id );
      consoleLine.innerHTML = logBuffer.join('<br>');
      logBuffer = [];
      i = 0;
    },
    highlight: function( isGreen, msg ){
      return '<span class="' + ( isGreen ? 'passed' : 'failed' ) + '">' + msg + '</span>';
    }
  });
})();

