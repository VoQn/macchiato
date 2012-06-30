
/**
 * @description logging temporary test result
 * @constructor
 */
var Result = function Result () {
   /** @type {boolean} */
   this.passed = false;
   /** @type {boolean */
   this.skipped = false;
   /** @type {string} */
   this.reason = 'Test has not run yes';
   /** @type {Array} */
   this.arguments = [];
};

/** @type {Result} */
var currentResult = new Result();

/**
 * @description mark as "Test was skipped"
 * @constructor
 */
var SkippedTest = function SkippedTest() {
  /** @const {boolean} */
  this.wasSkipped = true;
};

/**
 * @const {SkippedTest}
 */
var skippedTest = new SkippedTest();

/**
 * @param {Array.<function(): Object>} generator
 * @param {function(): (boolean|Object)} property
 * @return {function(): Result} test promise
 */
var forAll = function (generator, property) {
  var generators = isList(generator) ? generator : [generator],
      args = [],
      /** @type {boolean|SkippedTest} */
      result,
      apply_progress,
      testing = function (progress) {
        apply_progress = apply(progress);
        args = map(apply_progress, generators);

        try {
          result = property.apply(null, args);
        } catch (exception) {
          currentResult.passed = false;
          currentResult.skipped = false;
          currentResult.reason = 'Exception occurred: ' + exception;
          currentResult.arguments = args;
          return currentResult;
        }

        if (result.wasSkipped) {
          currentResult.passed = false;
          currentResult.skipped = true;
          currentResult.reason = 'Skipped: (' + args.join(', ') + ')';
        } else {
          currentResult.passed = result;
          currentResult.skipped = false;
          currentResult.reason = result ?
                                   '' :
                                   'Falsible: (' + args.join(', ') + ')';
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
var where = function (conditions, callback) {
  var i, l;

  for (i = 0, l = conditions.length; i < l; i++) {
    if (!conditions[i]) {
      return skippedTest;
    }
  }
  return callback();
};

