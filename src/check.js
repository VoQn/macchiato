
/**
 * @param {{passed: boolean, reason: string, arguments: Array}} stub
 * @constructor
 */
var Result = function( stub ){
  this.passed = stub.passed;
  this.reason = stub.reason;
  this.arguments = stub.arguments;
  return this;
};

/**
 * @param {Array.<function(): Object>} generators
 * @param {function(...[Object]): (boolean|Object)} property
 * @return {function(): Result} test promise
 */
var forAll = function( generators, property ){
  /** @return {Result} */
  var testing = function(){

    /** @type {Array} */
    var args = map( force, generators );

    /** @type {boolean} */
    var success;

    /** @type {string} */
    var reason;

    try {
      success = property.apply( property, args );
      reason = success ? '' : 'Falsible: (' + args.join(', ') + ')';
    } catch ( exception ) {
      success = false;
      reason = 'Exception occurred: ' + exception;
    }

    return new Result({
        passed: success,
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
  /** @type {number} */
  var i = 0;

  /** @type {number} */
  var l = conditions.length;

  for ( ; i < l; i++ ){
    if ( !conditions[ i ] ){
      return {
        wasSkipped: true
      };
    }
  }

  return callback();
};

