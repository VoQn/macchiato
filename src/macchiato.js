
/** @constructor */
var Macchiato = function Macchiato() {};

/** @type {Macchiato} */
var macchiato = new Macchiato();

/**
 * @private
 * @type {View}
 */
macchiato.view = consoleView;

/**
 * @private
 * @type {Array}
 */
macchiato.suites = [];

/**
 * @param {function():(boolean|SkippedTest)} property
 * @param {string=} opt_label
 * @param {number=} opt_count
 * @return {boolean}
 */
macchiato.quickcheck = function (property, opt_label, opt_count) {
  var progress,
      count    = !opt_count ? 100 : opt_count,
      label    = !opt_label ?  '' : opt_label + ' : ';

  score.clear();

  for (progress = 0; progress < count; progress++) {
    checker.run(progress, property, score);
    // something failed
    if(checker.shouldRetry) {
      macchiato.view.putLog(View.LOG_MODE.VERBOSE, checker.current);
      // retry
      checker.run(progress + 1, property, score);
      macchiato.view.putLog(View.LOG_MODE.VERBOSE, checker.current);
      break;
    }
  }

  score.evaluate();
  macchiato.view.putLog(
      View.LOG_MODE.PROPERTY_RESULT,
      macchiato.view.highlight(score.ok, label + score.message));

  return score.ok;
};

/**
 * @param {function():(boolean|SkippedTest)} property
 * @param {string=} opt_label
 * @param {number=} opt_count
 * @return {boolean}
 */
macchiato.verbosecheck = function (property, opt_label, opt_count) {
  var progress,
      count    = !opt_count ? 100 : opt_count,
      label    = !opt_label ?  '' : opt_label + ' : ';

  score.clear();

  for (progress = 0; progress < count; progress++) {
    checker.run(progress, property, score);
    macchiato.view.putLog(View.LOG_MODE.VERBOSE, checker.current);
    // something failed
    if (checker.shouldRetry) {
      checker.run(progress + 1, property, score);
      macchiato.view_.putLog(View.LOG_MODE.VERBOSE, checker.current);
      break;
    }
  }

  score.evaluate();
  macchiato.view.putLog(
      View.LOG_MODE.PROPERTY_RESULT,
      macchiato.view.highlight(score.ok, label + score.message));

  return score.ok;
};

/**
 * @param {boolean} verbose
 * @return {Macchiato}
 */
macchiato.setVerbose = function (verbose) {
  macchiato.view.verbose = verbose;
  return macchiato;
};

/**
 * @param {View} view
 * @return {Macchiato}
 */
macchiato.setView = function (view) {
  Interface.ensureImplements(view, ViewInterface);
  macchiato.view = view;
  return macchiato;
};

/**
 * @param {Object.<string, function():(boolean|SkippedTest)>} labeledProperties
 * @return {Macchiato}
 */
macchiato.stock = function (labeledProperties) {
  macchiato.suites.push(labeledProperties);
  return macchiato;
};

/**
 * @return {Macchiato}
 */
macchiato.taste = function () {
  var i, j, l, m, lable, labels,
      check      = macchiato.view.verbose ?
                      macchiato.verbosecheck :
                      macchiato.quickcheck,
      passed     = true,
      count      = macchiato.view.getTestCount(),
      suites     = macchiato.suites,

      start_t    = whatTimeIsNow(),
      end_test_t = 0,
      end_log_t  = 0;

  macchiato.view.standby();
  for (i = 0, l = suites.length; i < l; i++){
    labels = Object.keys(suites[i]);
    for (j = 0, m = labels.length; j < m; j++){
      label = labels[j];
      passed = check(suites[i][label],
                         label,
                         count) && passed;
    }
  }
  end_test_t = whatTimeIsNow();
  macchiato.view.dump();
  end_log_t = whatTimeIsNow();
  macchiato.view.putMsg(
        (passed ?
          'Ok, All tests succeeded!!' :
          'Oops! failed test exist...') +
        ' ( testing: ' + printTime(start_t, end_test_t) +
        ', log rendering: ' + printTime(end_test_t, end_log_t) + ' )');
  return macchiato;
};

