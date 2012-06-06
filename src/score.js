var Score = (function(){
  var Score = function(){},
      passed  = 0,
      failure = 0,
      skipped = 0;

  createSingleton( Score, {
    countUpSkipped: function(){
      skipped++;
    },
    countUpPassed: function(){
      passed++;
    },
    countUpFailure: function(){
      failure++;
    },
    clear: function(){
      passed  = 0;
      skipped = 0;
      failure = 0;
    },
    get: function(){
      return {
          passed: passed,
          failure: failure,
          skipped: skipped
      };
    },
    evaluate: function(){
      var score = this.get(),
          isOk = failure === 0,
          hasSkippedCase = skipped > 0,
          msg = '';
      msg = isOk ? ( '\u2713 OK, passed ' + passed ) : ( '\u2718 Failed. after ' + passed + skipped );
      msg += ' tests.';
      msg += skipped > 0 ? ( ' \u2662 skipped test' + skipped + ' cases' ) : '';
      return {
          ok: isOk,
          score: score,
          message: msg
      };
    }
  });

  return new Score();
})();
