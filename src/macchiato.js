
/** @constructor */
var Macchiato = function Macchiato(){};

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
macchiato.quickcheck = function( property, opt_label, opt_count ){
  var count_    = supplement( 100, opt_count ),
      progress_ = 0,
      ok_       = false,
      msg_;
  for ( ; progress_ < count_; progress_++ ){
    checker.run( progress_, property, score );
    // retry and break
    if( checker.shouldRetry ) {
      macchiato.view_.putLog( checker.current, true );
      checker.run( progress_ + 1, property, score );
      macchiato.view_.putLog( checker.current, true );
      break;
    }
  }
  score.evaluate();
  ok_ = score.ok;
  msg_ = ( opt_label ? opt_label + ' : ' : '' ) + score.message;
  macchiato.view_.putLog( macchiato.view_.highlight( ok_, msg_ ) );
  score.clear();
  return ok_;
};

/**
 * @param {function():(boolean|SkippedTest)} property
 * @param {string=} opt_label
 * @return {boolean}
 */
macchiato.verbosecheck = function( property, opt_label, opt_count ){
  var count_ = supplement( 100, opt_count ),
      progress_ = 0,
      msg_,
      ok_ = false;

  for ( ; progress_ < count_; progress_++ ){
    checker.run( progress_, property, score );
    macchiato.view_.putLog( checker.current, true );
    // retry and break
    if ( checker.shouldRetry ){
      checker.run( progress_ + 1, property, score );
      macchiato.view_.putLog( checker.current, true );
      break;
    }
  }
  score.evaluate();
  ok_ = score.ok;
  msg_ = ( opt_label ? opt_label + ' : ' : '' ) + score.message;
  macchiato.view_.putLog( macchiato.view_.highlight( ok_, msg_ ) );
  score.clear();
  return ok_;
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
  var _check_ = macchiato.view_.verbose ?
                macchiato.verbosecheck :
                macchiato.quickcheck,
      passed_ = true,
      index_ = 0,
      count_ = macchiato.view_.getTestCount(),
      length_ = macchiato.suites_.length,
      start_t_ = whatTimeIsNow(),
      end_test_t_,
      end_logging_t_;

  macchiato.view_.standby();
  for ( ; index_ < length_; index_++){
    for ( label_ in macchiato.suites_[ index_ ] ){
      passed_ = _check_( macchiato.suites_[ index_ ][ label_ ],
                         label_,
                         count_ ) && passed_;
    }
  }
  end_test_t_ = whatTimeIsNow();
  macchiato.view_.dump();
  end_logging_t_ = whatTimeIsNow();
  macchiato.view_.putMsg(
        ( passed_ ?
          'Ok, All tests succeeded!!' :
          'Oops! failed test exist...' ) +
        ' ( testing: ' + printTime( start_t_, end_test_t_ ) +
        ', log rendering: ' + printTime( end_test_t_, end_logging_t_ ) + ' )' );
  return macchiato;
};

