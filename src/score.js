
/** @constructor */
var Score = function(){};
/** @type {Score} */
var score = new Score();

/** @type {boolean} */
score.ok = false;
/** @type {number} */
score.passed  = 0;
/** @type {number} */
score.failure = 0;
/** @type {number} */
score.skipped = 0;
/** @type {string} */
score.message = 'Test has not run';

/**
 * @return {Score}
 */
score.clear = function(){
  score.ok = false;
  score.passed  = 0;
  score.skipped = 0;
  score.failure = 0;
  score.message = 'Test has not run';
  return score;
};

/**
 * @return {Score}
 */
score.evaluate = function(){
  score.ok = score.failure === 0;
  score.message = ( score.ok ?
    '\u2713 OK, passed ' + score.passed + '' :
    '\u2718 Failed. after ' + ( score.passed + score.skipped ) ) +
    ' tests.' +
    ( score.skipped > 0 ?
      ' \u2662 skipped ' + score.skipped + ' cases' :
      '' );
  return score;
};

