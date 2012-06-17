
/**
 * logging temporary test result
 */
var currentResult = (function(){
  /** @constructor */
  var Result = function(){
        /** @type {boolean} */
        this.passed = false;
        /** @type {boolean */
        this.skipped = false;
        /** @type {string} */
        this.reason = 'Test has not run yes';
        /** @type {Array} */
        this.arguments = [];
      },
      /** @type {Result} */
      result = new Result();
  return result;
})();


/**
 * mark as "Test was skipped".
 * @const {SkippedTest}
 */
var skippedTest = (function(){
  /** @constructor */
  var SkippedTest = function(){
         /** @const {boolean} */
         this.wasSkipped = true;
         return this;
      },
      /** @const {SkippedTest} */
      skippedTest = new SkippedTest();
  return skippedTest;
})();

/**
 * @param {Array.<function(): Object>} generators_
 * @param {function(): (boolean|Object)} property
 * @return {function(): Result} test promise
 */
var forAll = function( generators_, property ){
  var generators = isList( generators_ ) ?
                   generators_ :
                   [ generators ],
      args = [],
      /** @type {boolean|SkippedTest} */
      result;
  var testing = function( progress ){
    args = map( function( g ){ return g( progress ); },
                generators );
    try {
      result = property.apply( property, args );
    } catch ( exception ) {
      currentResult.passed = false;
      currentResult.skipped = false;
      currentResult.reason = 'Exception occurred: ' + exception;
      currentResult.arguments = args;
      return currentResult;
    }
    if ( result.wasSkipped ){
      currentResult.passed = false;
      currentResult.skipped = true;
      currentResult.reason = 'Skipped: (' + args.join(', ') + ')';
    } else {
      currentResult.passed = result;
      currentResult.skipped = false;
      currentResult.reason = result ? '' : 'Falsible: (' + args.join(', ') + ')';
    }
    currentResult.arguments = args;
    return currentResult;
  };
  return testing;
};

/**
 * @param {Array.<boolean>} conditions
 * @param {function(): boolean} callback
 * @return {{wasSkipped: boolean}|boolean} result of test
 */
var where = function( conditions, callback ){
  var index = 0,
      length = conditions.length;
  for ( ; index < length; index++ ){
    if ( !conditions[ index ] ){
      return skippedTest;
    }
  }
  return callback();
};

