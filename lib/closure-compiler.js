(function _init_module_(exports) {
  var util = require( 'util' ),
      http = require( 'http' ),
      querystring = require('querystring'),

      COMPILE_LEVEL = {
        SIMPLE: 'SIMPLE_OPTIMIZATIONS',
        WHITE_SPACE: 'WHITE_SPACE_ONLY',
        ADVANSED: 'ADVANCED_OPTIMIZATIONS'
      },

      OUTPUT_TYPE = {
        WARNING: 'WARNING',
        ERROR: 'ERRORS',
        COMPILED: 'COMPILED_CODE',
        STATISTICS: 'STATISTICS'
      },
      HOST = 'closure-compiler.appspot.com',
      PORT = 80,
      CONTENT_TYPE = 'application/x-www-form-urlencoded',
      REQUEST_PARAMS = {
        host: HOST,
        'Content-Type': CONTENT_TYPE
      },

      ClosureCompiler = function ClosureCompiler(){},

      compiler = new ClosureCompiler(),

      level_ = COMPILE_LEVEL.SIMPLE;

  Object.defineProperty( compiler, 'level', {
    enumerable: true,
    get: function(){
      return level_;
    },
    set: function( level ){
      for ( var key in COMPILE_LEVEL ){
        if ( level === hash[ key ] ){
          level_ = level;
        }
      }
      throw new Error( 'Unknown compilation level: ' + level );
    }
  });

  var parseResponse = function( next ){
    var onLoaded = function( err, obj ){
      var err_;
      if ( err ){
        next( err );
      } else if ( obj === undefined ) {
        next( new Error( 'Failed complete. nothing receive' ) );
      } else {
        if ( obj.hasOwnProperty( 'errors' ) ){
          err_ = obj.errors;
        } else if ( obj.hasOwnProperty( 'serverErrors' ) ){
          err_ = obj.serverErrors;
        } else if ( obj.hasOwnProperty( 'warnings' ) ){
          err_ = obj.warning;
        }
        if ( err_ ){
          next( new Error( 'Failed complete: ' + err_ ) );
        } else {
          next( null, obj );
        }
      }
    };

    var parse = function( err, data ){
      if ( err ){
        next( err );
      } else {
        loadJSON( data, onLoaded );
      }
    };

    return parse;
  };

  var loadJSON = function( data, next ){
    var obj;
    try {
      obj = JSON.parse( data );
      next( null, obj );
    } catch ( err ) {
      next( err );
    }
  };

  var capture = function( input, encoding, next ){
    var buffer = [], index = 0;
    input.on( 'data', function on_receive_data( data ){
      buffer[ index ] = data.toString( encoding );
      index++;
    }).on( 'end', function after_receive_all(){
      next( null, buffer.join('') );
    }).on( 'error', next );
  };

  var onResponse = function( next ){
    var parse, receive;

    parse = parseResponse( next );
    receive = function( res ){
      if ( res.statusCode !== 200 ){
        next( new Error( 'Unexpected HTTP response: ' + res.statusCode ));
      } else {
        capture( res, 'utf-8', parse );
      }
    };

    return receive;
  };

  var request = function (code, next, type){
    var body, params, client, request;

    body = querystring.stringify({
      js_code: code,
      output_format: 'json',
      output_info: type,
      compilation_level: level_
    });

    params = REQUEST_PARAMS;
    params['Content-Length'] = body.length;

    try {
      client = http.createClient( PORT, HOST ).on( 'error', next );
      request = client.request( 'POST', '/compile', params );
      request.on( 'error', next );
      request.on( 'response', onResponse( next ) );
      request.end( body );
    } catch ( err ){
      next( err );
    }
  };
  var keyHigh = function( key ){
    return '\033[1m\033[32m' + key + '\033[0m';
  };

  var valHigh = function( val ){
    return '\033[5m\033[36m' + val + '\033[0m';
  };

  compiler.compile = function( code, next ){
    request( code, function( err, data ){
      var key, status, value;
      if ( err ){
        console.log( util.inspect( err, false, null, true ) );
      } else {
        for ( key in data ){
          console.log( keyHigh( key ) + ':' );
          for ( status in data[ key ] ){
            value = data[ key ][ status ];
            console.log( '  ' +
                         keyHigh( status ) + ': ' +
                         valHigh( value ));
          }
        }
      }
    }, OUTPUT_TYPE.STATISTICS );
    request( code, next, OUTPUT_TYPE.COMPILED );
  };

  exports.client = compiler;
  exports.COMPILE_LEVEL = COMPILE_LEVEL;
  exports.OUTPUT_TYPE = OUTPUT_TYPE;

})(exports);
