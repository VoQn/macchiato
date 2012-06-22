
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
var forAll = function( generators, property ){
  var generators_ = isList( generators ) ?
                      generators :
                      [ generators ],
      args_ = [],
      /** @type {boolean|SkippedTest} */
      result_,
      _apply_progress_,
      _testing_ = function( progress ){
        _apply_progress_ = apply( progress );
        args_ = map( _apply_progress_, generators_ );
        try {
          result_ = property.apply( property, args_ );
        } catch ( exception ) {
          currentResult.passed = false;
          currentResult.skipped = false;
          currentResult.reason = 'Exception occurred: ' + exception;
          currentResult.arguments = args_;
          return currentResult;
        }
        if ( result_.wasSkipped ){
          currentResult.passed = false;
          currentResult.skipped = true;
          currentResult.reason = 'Skipped: (' + args_.join(', ') + ')';
        } else {
          currentResult.passed = result_;
          currentResult.skipped = false;
          currentResult.reason = result_ ?
                                   '' :
                                   'Falsible: (' + args_.join(', ') + ')';
        }
        currentResult.arguments = args_;
        return currentResult;
      };
  return _testing_;
};

/**
 * @param {Array.<boolean>} conditions
 * @param {function(): boolean} callback
 * @return {{wasSkipped: boolean}|boolean} result of test
 */
var where = function( conditions, callback ){
  var index_ = 0, length_ = conditions.length;

  for ( ; index_ < length_; index_++ ){
    if ( !conditions[ index_ ] ){
      return skippedTest;
    }
  }
  return callback();
};

