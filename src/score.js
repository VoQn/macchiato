
var score = (function(){

  /** @constructor */
  var Score = function(){
    this.ok = false;
    this.passed  = 0;
    this.failure = 0;
    this.skipped = 0;
    this.message = 'Test has not run';
    return this;
  };

  /** @type {Score} */
  var score = new Score();

  /**
   * @return {Score}
   */
  score.clear = function(){
    this.ok = false;
    this.passed  = 0;
    this.skipped = 0;
    this.failure = 0;
    this.message = 'Test has not run';
    return this;
  };

  /**
   * @return {Score}
   */
  score.evaluate = function(){
    this.ok = this.failure === 0;
    this.message = ( this.ok ?
      '\u2713 OK, passed ' + this.passed + '' :
      '\u2718 Failed. after ' + this.passed + this.skipped ) +
      ' tests.' +
      ( this.skipped > 0 ?
        ' \u2662 skipped ' + this.skipped + ' cases' :
        '' );
    return this;
  };

  return score;
})();
