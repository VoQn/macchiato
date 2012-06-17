/** @type {Checker} */
var checker = (function(){
  /**
   * @constructor
   */
  var Checker = function(){},
      args = [],
      passed = false,
      skipped = false,
      shouldView = false,
      currentLog = '',
      /** @enum {string} */
      marks = {
        skipped: '\u2662',
        passed: '\u2713',
        faild: '\u2718'
      },
      /** @type {Checker} */
      checker = new Checker();

  /**
   * @param {number} progress
   * @param {function():Result} test
   * @param {Score} score
   */
  checker.run = function( progress, test, score ){
    var result = test( progress );
    args = result.arguments;
    if ( result.skipped ) {
      skipped = true;
    } else {
      skipped = false;
      passed = result;
    }
    return logging( score );
  };

  /**
   * @param {string|Object} a
   * @return {string}
   */
  var wrapQuote = function( a ){
    if ( typeof a === 'string' ){
      return '"' + a + '"';
    }
    return a + '';
  };

  /**
   * @param {Score} score
   */
  var logging = function( score ){
    var kind;
    if ( skipped ) {
      kind = 'skipped';
      score.skipped++;
    } else if ( passed ){
      kind = 'passed';
      score.passed++;
    } else {
      kind = 'faild';
      score.failure++;
      shouldView = true;
    }
    currentLog = marks[ kind ] +
      " ( " + map( wrapQuote, args ).join(', ') + ' )';
    return {
      shouldView: shouldView,
      current: currentLog
    };
  };

  return checker;
})();

