
var forAll = function( generators, property ){
  var testing = function(){
    var args = map( force, generators ),
        success,
        reason;

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
  var i = 0,
      l = conditions.length;

  for ( ; i < l; i++ ){
    if ( !conditions[ i ] ){
      return {
        wasSkipped: true
      };
    }
  }

  return callback();
};

