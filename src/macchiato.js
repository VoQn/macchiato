
var macchiato = (function(){
  /** @constructor */
  var Macchiato = function(){},
      /** @type {Macchiato} */
      macchiato = new Macchiato(),

      // Internal members
      /** @type {View} */
      view = consoleView,
      /** @type {Array} */
      suites = [],

      // Use at quickcheck & verbosecheck
      /** @type {number} */
      progress = 0,
      /** @type {boolean} */
      ok = false,
      /** @type {number} test count */
      count,
      // alias of view.highlight
      highlight,
      /** @type {{shouldView: boolean, current: string}} */
      log,
      /** @type {string} */
      msg,
      /** @type {{ok: boolean, message: string}} */
      result,

      /**
       * @param {function():(boolean|SkippedTest)} property
       * @param {string=} opt_label
       * @return {boolean}
       */
      quickcheck = function( property, opt_label ){
        // alias
        var run = checker.run,
            put = view.putLog;
        for ( progress = 0; progress < count; progress++ ){
          log = run( progress, property, score );
          if( log.shouldView ) {
            put( log.current, true );
          }
        }
        result = score.evaluate();
        ok = result.ok;
        msg = ( opt_label ? opt_label + ' : ' : '' ) + result.message;
        put( highlight( ok, msg ) );
        score.clear();
        return ok;
      },
      /**
       * @param {function():(boolean|SkippedTest)} property
       * @param {string=} opt_label
       * @return {boolean}
       */
      verbosecheck = function( property, opt_label ){
        var run = checker.run,
            put = view.putLog;
        for ( progress = 0; progress < count; progress++ ){
          log = run( progress, property, score );
          put( log.current, true );
        }
        result = score.evaluate();
        ok = result.ok;
        msg = ( opt_label ? opt_label + ' : ' : '' ) + result.message;
        put( highlight( ok, msg ) );
        score.clear();
        return ok;
      },

      // Use at macchiato.taste()
      /** @type {boolean} */
      passed = true,
      /** @type {number} */
      index = 0,
      /** @type {Object.<string, function():(boolean|SkippedTest)>} */
      suite,
      /** @type {string} */
      label = '',
      // alias of "quickcheck" or "verbosecheck"
      check,
      /** @type {function():(boolean|SkippedTest)} */
      property;
  /**
   * @param {boolean} verbose
   * @return {Macchiato}
   */
  macchiato.setVerbose = function( verbose ){
    view.verbose = verbose;
    return this;
  };
  /**
   * @param {View} view_
   * @return {Macchiato}
   */
  macchiato.setView = function( view_ ){
    Interface.ensureImplements( view_, ViewInterface );
    view = view_;
    return this;
  };
  /**
   * @param {Object.<string, function():(boolean|SkippedTest)>} labeledProperties
   * @return {Macchiato}
   */
  macchiato.stock = function( labeledProperties ){
    suites.push( labeledProperties );
    return this;
  };
  /**
   * @return {Macchiato}
   */
  macchiato.taste = function(){
    view.standby();
    check = view.verbose ? verbosecheck : quickcheck;
    count = view.getTestCount();
    highlight = view.highlight;
    for ( index = 0; suite = suites[ index ]; index++){
      for ( label in suite ){
        property = suite[ label ];
        passed = passed && check( property, label );
      }
    }
    view.dump();
    view.putMsg( passed ?
        'Ok, All tests succeeded!!' :
        'Oops! failed test exist...' );
    return this;
  };
  return macchiato;
})();

window.macchiato = macchiato;
