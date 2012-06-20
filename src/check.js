
/**
 * @description logging temporary test result
 * @constructor
 */
function Result(){
   /** @type {boolean} */
   this.passed = false;
   /** @type {boolean */
   this.skipped = false;
   /** @type {string} */
   this.reason = 'Test has not run yes';
   /** @type {Array} */
   this.arguments = [];
}

/** @type {Result} */
var currentResult = new Result();

/**
 * @description mark as "Test was skipped"
 * @constructor
 */
function SkippedTest(){
  /** @const {boolean} */
  this.wasSkipped = true;
}

/**
 * @const {SkippedTest}
 */
var skippedTest = new SkippedTest();

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
    args = map( function _apply_progress ( g ){ return g( progress ); },
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

