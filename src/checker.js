/**
 * @constructor
 */
var Checker = function Checker() {};

/** @type {Checker} */
var checker = new Checker();

/** @type {boolean} */
checker.shouldRetry = false;
/** @type {string} */
checker.current = '';
/** @type {string} */
checker.why = '';
/** @enum {string} */
checker.marks = {
  skipped: '\u2662',
  passed: '\u2713',
  faild: '\u2718'
};

/**
 * @param {string|Object} a
 * @return {string}
 */
checker.wrapQuote = function (a) {
  if (typeof a === 'string') {
    return '"' + a + '"';
  }
  return a;
};

/**
 * @param {Result} result
 * @param {Score} score
 */
checker.logging = function (result, score) {
  var mark;
  checker.shouldRetry = false;
  if (result.skipped) {
    mark = checker.marks.skipped;
    score.skipped++;
  } else if (result.passed) {
    mark = checker.marks.passed;
    score.passed++;
  } else {
    mark = checker.marks.faild;
    score.failure++;
    checker.shouldRetry = true;
  }
  checker.current = mark + ' ( ' +
                    map(checker.wrapQuote,
                        result.arguments).join(', ') +
                    ' )';
  checker.why = result.reason;
  return checker;
};

/**
 * @param {number} progress
 * @param {function():Result} test
 * @param {Score} score
 * @return {Checker}
 */
checker.run = function (progress, test, score) {
  var result = test(progress);
  return checker.logging(result, score);
};

