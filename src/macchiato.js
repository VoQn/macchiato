
/** @constructor */
var Macchiato = function(){};
/** @type {Macchiato} */
var macchiato = new Macchiato();

/**
 * @private
 * @type {View}
 */
macchiato.view_ = consoleView;
/**
 * @private
 * @type {Array}
 */
macchiato.suites_ = [];
/**
 * @param {function():(boolean|SkippedTest)} property
 * @param {string=} opt_label
 * @return {boolean}
 */
macchiato.quickcheck = function( property, opt_label ){
  var view = macchiato.view_,
      count = view.getTestCount(),
      progress = 0,
      msg,
      ok = false;
  for ( progress = 0; progress < count; progress++ ){
    checker.run( progress, property, score );
    // retry and break
    if( checker.shouldRetry ) {
      view.putLog( checker.current, true );
      checker.run( progress + 1, property, score );
      view.putLog( checker.current, true );
      break;
    }
  }
  score.evaluate();
  ok = score.ok;
  msg = ( opt_label ? opt_label + ' : ' : '' ) + score.message;
  view.putLog( view.highlight( ok, msg ) );
  score.clear();
  return ok;
};
/**
 * @param {function():(boolean|SkippedTest)} property
 * @param {string=} opt_label
 * @return {boolean}
 */
macchiato.verbosecheck = function( property, opt_label ){
  var view = macchiato.view_,
      count = view.getTestCount(),
      progress = 0,
      msg,
      result,
      ok = false;
  for ( progress = 0; progress < count; progress++ ){
    checker.run( progress, property, score );
    view.putLog( checker.current, true );
    // retry and break
    if ( checker.shouldRetry ){
      checker.run( progress + 1, property, score );
      view.putLog( checker.current, true );
      break;
    }
  }
  result = score.evaluate();
  ok = result.ok;
  msg = ( opt_label ? opt_label + ' : ' : '' ) + result.message;
  view.putLog( view.highlight( ok, msg ) );
  score.clear();
  return ok;
};
/**
 * @param {boolean} verbose
 * @return {Macchiato}
 */
macchiato.setVerbose = function( verbose ){
  macchiato.view_.verbose = verbose;
  return macchiato;
};
/**
 * @param {View} view
 * @return {Macchiato}
 */
macchiato.setView = function( view ){
  Interface.ensureImplements( view, ViewInterface );
  macchiato.view_ = view;
  return macchiato;
};
/**
 * @param {Object.<string, function():(boolean|SkippedTest)>} labeledProperties
 * @return {Macchiato}
 */
macchiato.stock = function( labeledProperties ){
  macchiato.suites_.push( labeledProperties );
  return macchiato;
};
/**
 * @return {Macchiato}
 */
macchiato.taste = function(){
  var view = macchiato.view_,
      check = view.verbose ? macchiato.verbosecheck : macchiato.quickcheck,
      passed = true,
      index = 0,
      suites = macchiato.suites_,
      suite,
      property;
  view.standby();
  for ( ; suite = suites[ index ]; index++){
    for ( label in suite ){
      property = suite[ label ];
      passed = check( property, label ) && passed;
    }
  }
  view.dump();
  view.putMsg( passed ?
        'Ok, All tests succeeded!!' :
        'Oops! failed test exist...' );
  return macchiato;
};

