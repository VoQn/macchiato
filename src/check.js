
var forAll = function( generators, property ){
  var testing = function(){
    var args, success, reason;
    args = map( function( f ){
      return f();
    }, generators );

    try {
      success = property.apply( property, args );
      reason = success ? '' : 'Falsible: (' + args.join(', ') + ')';
    } catch ( exception ) {
      success = false;
      reason = 'Exception occurred: ' + exception.getMessage();
    }

    return {
        passed: success,
        reason: reason,
        arguments: args
    };
  };
  return testing;
};

var where = function( conditions, callback ){
  var i = 0, l = conditions.length;
  while ( i < l ){
    if ( !conditions[ i ] ){
      return {
        wasSkipped: true
      };
    }
    i++;
  }
  return callback();
};

var prop = forAll;

