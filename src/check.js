
/**
 * @param {{passed: boolean, skipped: boolean, reason: string, arguments: Array}} stub
 * @constructor
 */
var Result = function( stub ){
  this.passed = stub.passed;
  this.skipped = stub.skipped;
  this.reason = stub.reason;
  this.arguments = stub.arguments;
  return this;
};

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
      success = false,
      reason = '',
      test;
  var testing = function(){
    args = map( force, generators );
    try {
      test = property.apply( property, args );
      if ( test.wasSkipped ){
        reason = 'Skipped: (' + args.join(', ') + ')';
        return new Result({
          passed: false,
          skipped: true,
          reason: reason,
          arguments: args
        });
      }
      successs = test;
      reason = test ? '' : 'Falsible: (' + args.join(', ') + ')';
    } catch ( exception ) {
      success = false;
      reason = 'Exception occurred: ' + exception;
    }
    return new Result({
        passed: success,
        skipped: false,
        reason: reason,
        arguments: args
    });
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
      length = conditions.length,
      shouldSkip;
  for ( ; index < length; index++ ){
    shouldSkip = !conditions[ index ];
    if ( shouldSkip ){
      return { wasSkipped: true };
    }
  }
  return callback();
};

