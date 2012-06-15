/**
 * @type {Score}
 */
var score = (function(){

  /**
   * @constructor
   */
  var Score = function(){
     /**
      * @type {number}
      */
    this.passed  = 0;
    /**
     * @type {number}
     */
    this.failure = 0;
    /**
     * @type {number}
     */
    this.skipped = 0;
    return this;
  };

  /**
   * @type {Score}
   */
  var score = new Score();

  /**
   * @return {Score}
   */
  score.clear = function(){
    this.passed  = 0;
    this.skipped = 0;
    this.failure = 0;
    return this;
  };

  score.evaluate = function(){
    var isOk = this.failure === 0;
    var hasSkippedCase = this.skipped > 0;
    var msg = ( isOk ?
      '\u2713 OK, passed ' + this.passed + '' :
      '\u2718 Failed. after ' + this.passed + this.skipped ) +
      ' tests.' +
      ( this.skipped > 0 ?
        ' \u2662 skipped test' + this.skipped + ' cases' :
        '' );
    return {
      ok: isOk,
      score: this,
      message: msg
    };
  };

  return score;
})();
