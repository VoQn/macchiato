
/** @type {Interface} */
var ViewInterface = new Interface('ViewInterface', [
    'getTestCount',
    'standby',
    'clean',
    'putMsg',
    'putLog',
    'dump',
    'highlight'
    ]);

/**
 * @description Tester View
 * @constructor
 */
var View = function View(){};

/**
 * @enum {string}
 */
View.LOG_MODE = {
  VERBOSE: 'verbose',
  PROPERTY_RESULT: 'property',
  TOTAL: 'total'
};

/**
 * @param {Object} stub
 * @return {View}
 */
var createView = function( stub ){
  var view_ = new View(),
      name_ = '';
  for ( name_ in stub ){
    view_[ name_ ] = stub[ name_ ];
  }
  Interface.ensureImplements( view_, ViewInterface );
  return view_;
};

/**
 * @type {View}
 */
var consoleView = (function _init_console_view_(){
  var log_buffer_ = [],
      i_ = 0;
  return createView({
  getTestCount: function(){
    return 100;
  },
  standby: function(){
    if ( console.clear ){ // for firebug ( Firefox extension )
      console.clear();
    }
    log_buffer_ = [];
    i_ = 0;
  },
  clean: function(){
    log_buffer_ = [];
    i_ = 0;
  },
  putMsg: function( msg ){
    console.log( msg );
  },
  putLog: function( msg, withEscape ){
    log_buffer_[i_] = msg;
    i_++;
  },
  dump: function(){
    if ( log_buffer_.length > 0 ){
      console.log( log_buffer_.join('\n') );
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
var htmlView = (function _init_html_view_(){
  var log_buffer_ = [],
      i_ = 0,
      _by_id_ = function( id ){
        return document.getElementById( id );
      };

  return createView({
    selectors:{
      counter_id: 'test-count',
      messenger_id: 'test-message',
      logger_id: 'test-log'
    },
    setSelectors: function( identifers ){
      var members_ = this.selectors,
          name_ = '';
      for ( name_ in members_ ){
        if ( identifers[ name_ ] === undefined ){
          throw new Error('html-test-view need selector id :' + name_ + ', but undefined');
        }
        this.selectors[ name_ ] = identifers[ name_ ];
      }
      return this;
    },
    getTestCount: function(){
      return parseInt( _by_id_( this.selectors.counter_id ).value, 10 );
    },
    standby: function(){
      log_buffer_ = [];
      i_ = 0;
    },
    clean: function(){
      log_buffer_ = [];
    },
    putMsg: function( msg ){
      var board_ = _by_id_( this.selectors.messenger_id );
      board_.innerHTML = msg;
    },
    putLog: function( mode, log ){
      var log_ = '';
      if ( mode === View.LOG_MODE.VERBOSE ){
        log_ = '<p>' + htmlEscape( log ) + '</p>';
      } else {
        log_ = log;
      }
      log_buffer_[ i_ ] =  log_;
      i_++;
    },
    dump: function(){
      var consoleLine_ = _by_id_( this.selectors.logger_id );
      consoleLine_.innerHTML = log_buffer_.join('');
      log_buffer_ = [];
      i_ = 0;
    },
    highlight: function( isGreen, msg ){
      return '<p class="' + ( isGreen ? 'passed' : 'failed' ) + '">' + msg + '</p>';
    }
  });
})();

