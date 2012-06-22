
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
 * @param {number=} opt_count
 * @return {boolean}
 */
macchiato.quickcheck = function( property, opt_label, opt_count ){
  var count_    = !opt_count ? 100 : opt_count,
      label_    = !opt_label ?  '' : opt_label + ' : ',
      progress_ = 0;

  score.clear();

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
  macchiato.view_.putLog(
      macchiato.view_.highlight( score.ok, label_ + score.message ) );

  return score.ok;
};

/**
 * @param {function():(boolean|SkippedTest)} property
 * @param {string=} opt_label
 * @param {number=} opt_count
 * @return {boolean}
 */
macchiato.verbosecheck = function( property, opt_label, opt_count ){
  var count_    = !opt_count ? 100 : opt_count,
      label_    = !opt_label ?  '' : opt_label + ' : ',
      progress_ = 0;

  score.clear();

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
  macchiato.view_.putLog(
      macchiato.view_.highlight( score.ok, label_ + score.message ) );

  return score.ok;
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
  var _check_     = macchiato.view_.verbose ?
                      macchiato.verbosecheck :
                      macchiato.quickcheck,
      passed_     = true,
      index_      = 0,
      label_      = '',
      count_      = macchiato.view_.getTestCount(),
      length_     = macchiato.suites_.length,

      start_t_    = whatTimeIsNow(),
      end_test_t_ = 0,
      end_log_t_  = 0;

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
  end_log_t_ = whatTimeIsNow();
  macchiato.view_.putMsg(
        ( passed_ ?
          'Ok, All tests succeeded!!' :
          'Oops! failed test exist...' ) +
        ' ( testing: ' + printTime( start_t_, end_test_t_ ) +
        ', log rendering: ' + printTime( end_test_t_, end_log_t_ ) + ' )' );
  return macchiato;
};

