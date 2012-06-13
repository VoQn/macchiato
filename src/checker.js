/** @type {Checker} */
var checker = (function(){
  /**
   * @constructor
   */
  var Checker = function( ){
    /** @type {Array} */
    this.args = [];
    /** @type {boolean} */
    this.passed = false;
    /** @type {boolean} */
    this.skipped = false;
    /** @type {string} */
    this.currentLog = '';

    return this;
  };

  /** @enum {string} */
  var marks = {
    skipped: '\u2662',
    passed: '\u2713',
    faild: '\u2718'
  };

  /** @type {Checker} */
  var checker = new Checker();

  /**
   * @return {Array}
   */
  checker.getArgs = function(){
    return this.args;
  };

  /**
   * @return {boolean}
   */
  checker.isPassed = function(){
    return this.passed;
  };

  /**
   * @return {boolean}
   */
  checker.isSkipped = function(){
    return this.skipped;
  };

  /**
   * @return {string}
   */
  checker.lastResult = function(){
    return this.currentLog;
  };


  /**
   * @param {function():Result} test
   * @param {boolean} onVerbose
   * @param {Score} score
   */
  checker.run = function( test, onVerbose, score ){
    var result = test();
    this.args = result.arguments;
    if ( !!result.wasSkipped ) {
        this.skipped = result.wasSkipped;
    } else {
      this.skipped = false;
      this.passed = result;
    }
    this.log( onVerbose, score );
  };

  /**
   * @param {boolean} verbose
   * @param {Score} score
   */
  checker.log = function( verbose, score ){
    var kind;
    var shouldView = false;
    var wrapQuote = function( a ){
      if ( typeof a === 'string' ){
        return '"' + a + '"';
      }
      return a + '';
    };

    if ( this.skipped ) {
      kind = 'skipped';
      score.countUpSkipped();
    } else if ( this.passed ){
      kind = 'passed';
      score.countUpPassed();
    } else {
      kind = 'faild';
      score.countUpFailure();
      shouldView = true;
    }

    this.currentLog = marks[ kind ] +
      " ( " + map( wrapQuote, this.args ).join(', ') + ' )';
  };

  return checker;
})();

