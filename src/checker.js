/** @type {Checker} */
var checker = (function(){
  /**
   * @constructor
   */
  var Checker = function( ){
    this.args = [];
    this.passed = false;
    this.skipped = false;
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
   * @param {function():Result} test
   * @param {boolean} onVerbose
   * @param {Score} score
   */
  checker.run = function( test, onVerbose, score ){
    var result = test();
    this.args = result.arguments;
    if ( result.skipped ) {
        this.skipped = true;
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
    var wrapQuote = function( a ){
      if ( typeof a === 'string' ){
        return '"' + a + '"';
      }
      return a + '';
    };

    if ( this.skipped ) {
      kind = 'skipped';
      score.skipped++;
    } else if ( this.passed ){
      kind = 'passed';
      score.passed++;
    } else {
      kind = 'faild';
      score.failure++;
      this.shouldView = true;
    }

    this.currentLog = marks[ kind ] +
      " ( " + map( wrapQuote, this.args ).join(', ') + ' )';
  };

  return checker;
})();

