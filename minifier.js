
var sys = require('util'),
    fs = require('fs'),
    http = require('http'),
    querystring = require('querystring'),
    /** @enum {string} */
    LEVEL = {
      SIMPLE: 'SIMPLE_OPTIMIZATIONS',
      WHITE_SPACE: 'WHITE_SPACE_ONLY',
      ADVANSED: 'ADVANCED_OPTIMIZATIONS'
    },
    /** @enum {string} */
    OUTPUT_INFO_TYPE = {
      WARNING: 'WARNING',
      ERROR: 'ERRORS',
      COMPILED: 'COMPILED_CODE',
      STATISTICS: 'STATISTICS'
    },
    /**
     * @const
     * @type {string}
     */
    HOST = 'closure-compiler.appspot.com',
    /**
     * @const
     * @type {number}
     */
    PORT = 80,
    /**
     * @const
     * @type {string}
     */
    CONTENT_TYPE = 'application/x-www-form-urlencoded',
    /** @const {{host:string, Comtent-Type:string}} */
    REQUEST_PARAMS = {
      'host': HOST,
      'Content-Type': CONTENT_TYPE
    };

/**
 * @param {string} label
 * @param {Object.<string, string>} parameters
 * @param {string=} opt_param
 * @throws {Error} If opt_params isn't known parameter
 */
function validateOption( label, parameters, opt_param ){
  if ( opt_param ){
    for ( var type in parameters ){
      if ( parameters.hasOwnProperty( type ) &&
           opt_param === parameters[ type ] ){
        return; // opt_param signature is known parameter
      }
    }
    throw new Error( 'unknown ' + label + ': ' + opt_param );
  }
}

/**
 * @param {Object} option
 * @throws {Error} If option has not known parameter
 */
function validate( option ){
  validateOption( 'compilation_level',
                  LEVEL,
                  option.compilation_level );
  validateOption( 'output_info',
                  OUTPUT_INFO_TYPE,
                  option.output_info );
}

function createBody( code, option ){
  return querystring.stringify({
    js_code: code,
    output_format: 'json',
    output_info: option.output_info || OUTPUT_INFO_TYPE.COMPILED,
    compilation_level: option.compilation_level || LEVEL.SIMPLE
  });
}

function createRequestParams( body ){
  var params = REQUEST_PARAMS;
  params['Content-Length'] = body.length;
  return params;
}

function rec_compile( code, next, opt_option ){
  var option = opt_option || {},
      info = option.output_info,
      index = -1,
      length;
  if ( Array.isArray( info ) ){
    for ( length = info.length; index < length; index++ ){
      option.output_info = info[ index ];
      compile( code, next, option );
    }
    return;
  }
}

function compile( code, next, opt_option ){
  var option = opt_option || {},
      body = createBody( code, option ),
      params = createRequestParams( body ),
      client,
      request;

  try {
    validate( option );
    client = http.createClient( PORT, HOST ).on( 'error', next );
    request = client.request( 'POST', '/compile', params );
    request.on( 'error', next );
    request.on( 'response', createResponse( next ) );
    request.end( body );
  } catch ( exception ) {
    next( exception );
  }
}

function createResponse( next ){
  var parseResponse = createParseResponse( next );
  return function _on_response( res ){
    if ( res.statusCode !== 200 ){
      next( new Error('Unexpected HTTP response: ' + res.statusCode ));
    } else {
      capture( res, 'utf-8', parseResponse );
    }
  };
}

function capture( input, encoding, next ){
  var buffer = [], index = 0;

  input.on( 'data', function _get_data( chunk ){
    buffer[ index ] = chunk.toString( encoding );
    index++;
  });

  input.on( 'end', function _receive_all(){
    next( null, buffer.join('') );
  });

  input.on( 'error', next );
}

function createParseResponse( next ){
  function _json_loaded( err, obj ){
    var e;

    if ( err ){
      next( err );
    } else if (( e = obj.errors || obj.serverErrors || obj.warnings )){
      next( new Error( 'Failed complete: ' + sys.inspect( e ) ) );
    } else {
      next( null, obj.compiledCode );
    }
  }

  return function _parse_response( error, data ){
    if ( error ){
      next( error );
    } else {
      loadJSON( data, _json_loaded );
    }
  };
}

function loadJSON( data, next ){
  var error, object;
  try {
    object = JSON.parse( data );
  } catch ( err ) {
    error = err;
  }
  next( error, object );
}

var source = './dist/macchiato.js',
    dist = './dist/macchiato.min.js';

fs.readFile( source, 'utf-8', writeMinJS );

function writeJsFile( error, compiled ){
  if ( error ) {
    sys.puts( sys.inspect( error ) );
    return;
  }
  fs.writeFile( dist, compiled, function _after_write( e ){
    if ( e ) throw e;
    console.log( 'saved ' + dist );
  });
}

function writeMinJS( err, data ){
  var code;
  if ( err ) console.log( err );
  code = data + 'window.macchiato = macchiato;';
  compile(
    code, writeJsFile,
    {
      compilation_level: LEVEL.SIMPLE,
      output_info: OUTPUT_INFO_TYPE.COMPILED
    });
}

