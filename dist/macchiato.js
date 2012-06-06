// Utility

/**
 * @param {function() : Object} promise
 * @return {Object}
 */
var force = function( promise ){
  return promise();
};

/**
 * @param {!Object} object
 * @return {boolean} parameter is kind of list or not
 */
var is_list = function( object ) {
  /** @type {string|number} */
  var i = 0;
  /** @type {Array} */
  var classes = [ Array, NodeList, HTMLCollection ];
  /** @type {number} */
  var l = classes.length;

  for ( ; i < l; i++ ){
    if ( object instanceof classes[ i ] ){
      return true;
    }
  }

  return false;
};

/**
 * @param {!Object} object
 * @return {boolean} parameter is empty or not
 */
var is_empty = function( object ){
  /** @type {string} */
  var _;
  for ( _ in obj ){
    return false;
  }
  return true;
};

/**
 * @param {function(Object, (string|number)=)} callback
 * @param {!Array|!Object} elements
 * @return {!Array|!Object} new array or object
 */
var map = function( callback, elements ){
  /** @type {string|number} */
  var i = 0;

  /** @type {Array|Object} */
  var result = [];

  /**
   * @param {string|number} index of elements
   */
  var put = function( index ){
    result[ index ] = callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    /** @type {number} */
    var l = elements.length;
    for ( ; i < l; i++ ){
      put( i );
    }
  } else {
    result = {};
    for ( i in elements ){
      if ( elements.hasOwnProperty( i ) ){
        put( i );
      }
    }
  }

  return result;
};

/**
 * @param {function(Object, (string|number)=)} callback
 * @param {!Array|!Object} elements
 */
var each = function( callback, elements ){
  /** @type {string|number} */
  var i = 0;
  /**
   * @param {string|number} index of elements
   */
  var call = function( index ){
    callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    /** @type {number} */
    var l = elements.length;
    for ( ; i < l; i++ ){
      call( i );
    }
  } else {
    for ( i in elements ) {
      if ( elements.hasOwnProperty( i ) ){
        call( i );
      }
    }
  }
};

/**
 * @param {function(Object, number=): boolean} callback
 * @param {!Array} elements
 * @return {!Array} new array list
 */
var filter = function( callback, elements ){
  /** @type {number} */
  var i = 0;
  /** @type {number} */
  var l = elements.length;
  /** @type {!Array} */
  var result = [];
  /** @type {Object} */
  var x;
  for ( ; i < l; i++ ){
    x = elements[ i ];
    if ( callback( x, i ) ){
      result.push( x );
    }
  }
  return result;
};

/**
 * @param {!Object} object
 * @param {!Object} methods
 * @return {!Object} class instance
 */
var createSingleton = function( object, methods ){
  object.prototype = methods;
};


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

var Score = (function(){
  var Score = function(){},
      passed  = 0,
      failure = 0,
      skipped = 0;

  createSingleton( Score, {
    countUpSkipped: function(){
      skipped++;
    },
    countUpPassed: function(){
      passed++;
    },
    countUpFailure: function(){
      failure++;
    },
    clear: function(){
      passed  = 0;
      skipped = 0;
      failure = 0;
    },
    get: function(){
      return {
          passed: passed,
          failure: failure,
          skipped: skipped
      };
    },
    evaluate: function(){
      var score = this.get(),
          isOk = failure === 0,
          hasSkippedCase = skipped > 0,
          msg = '';
      msg = isOk ? ( '\u2713 OK, passed ' + passed ) : ( '\u2718 Failed. after ' + passed + skipped );
      msg += ' tests.';
      msg += skipped > 0 ? ( ' \u2662 skipped test' + skipped + ' cases' ) : '';
      return {
          ok: isOk,
          score: score,
          message: msg
      };
    }
  });

  return new Score();
})();

var Seed = (function(){
  var Seed = function(){}, value = 1, instance;
  createSingleton( Seed, {
    getRange: function(){
      var mx = Math.pow( 2, ( Math.round( value / 1.5 )) );
      return Math.round( Math.random() * mx );
    },
    grow: function(){
      value++;
    },
    clear: function(){
      value = 0;
    }
  });
  return new Seed();
})();


var Combinator = (function(){
  var Combinator = function(){}, instance;

  createSingleton( Combinator, {
    sized: function( generateBySize ){
      var generate = function(){
        return generateBySize( Seed.getRange() );
      };
      return generate;
    },
    resize: function( size, generatorBySize ){
      var generate = function(){
        return generateBySize( size );
      };
      return generate;
    },
    choose: function( low, high ){
      var generate = function(){
        var l = Math.random() * low,
            h = Math.random() * high,
            i = l + h,
            r = Math.min( high, Math.max( low, i ));
        return i;
      };
      return generate;
    },
    elements: function( list ){
      var that = this, generate;
      generate = function(){
        var index = Math.round( that.choose( 0, list.length - 1 )() ),
            item = list[ index ];
        return item;
      };
      return generate;
    },
    oneOf: function( generators ){
      var generate = this.elements( generators );
      return generate;
    },
    listOf: function( generator ){
      var that = this, generate;
      generate = that.sized(function( n ){
          var log = Math.LOG10E * Math.log( n ),
              length = Math.round( log ) * 10,
              list = that.vectorOf( length, generator )();
          return list;
      });
      return generate;
    },
    listOf1: function( generator ){
      var that = this, generate;
      generate = that.sized(function( n ){
        var log = Math.LOG10E * Math.log( n ),
            length = Math.ceil( log ) * 10,
            list = that.vectorOf( length, generator )();
        return list;
      });
      return generate;
    },
    vectorOf: function( length, generator ){
      var generate = function(){
        var i = 0,
            list = [];
        for ( ; i < length; i++ ){
          list[ i ] = generator();
        }
        return list;
      };
      return generate;
    }
  });

  return new Combinator();
})();


var quadratic = function( a, _b, _c ){
  var b = _b || 1, c = _c || 0;
  return function( x, r ){
    return a * Math.pow( x, 2 ) + b * x + c;
  };
};

var GenerateRefference = (function(){
  var GenerateRefference = function(){},
      method,
      C = Combinator;

  method = {
    bool: function( ){
      var b = C.elements([ false, true ])();
      return b;
    },
    integer: C.sized(function( n ){
        var i = C.choose( (-n), n )();
        return Math.round( i );
    }),
    decimal: C.sized(function( _n ){
        var prec = 9999999999999,
            b = C.choose( 0, ( _n ) )(),
            n = C.choose( (-b) * prec, b * prec )(),
            d = C.choose( 1, prec )();
        return Math.round( n ) / Math.round( d );
    }),
    charator: function(){
      var g = C.oneOf( [ C.choose( 0, 127 ), C.choose( 0xe000, 0xfffd ), C.choose( 0x10000, 0x10ffff ) ] )(),
          c = String.fromCharCode( Math.round( g() ) );
      return c;
    }
  };

  method.number = method.decimal;
  method.string = function(){
    var cs = C.listOf1( method.charator )(), i = 0, l = cs.length, str = '';
    for ( ; i < l; i++ ) {
      str += cs[ i ];
    }
    return str;
  };

  createSingleton( GenerateRefference, method );

  return new GenerateRefference();
})();

var Generator = function( gs ){
  this.generators = gs;
  return this;
};

Generator.prototype.property = function( property ){
  return forAll( this.generators, property );
};

var arbitrary = function(/* */){
  var types, prepare, instance;

  types = Array.prototype.slice.call( arguments, 0, arguments.length );

  prepare = function( t ){
    var test = /\[\s+([a-z]+)\s+\]/.exec( t );
    if ( test ){
      return elements( Generator[ test[ 1 ] ] );
    }
    return GenerateRefference[ t ];
  };

  instance = new Generator( map( prepare, types ) );

  return instance;
};

var Checker = (function(){
  var Checker = function(){},
      args = [],
      passed = false,
      skipped = false,
      marks = {
        skipped: '\u2662',
        passed: '\u2713',
        faild: '\u2718'
    },
      currentLog;

  createSingleton( Checker, {
    getArgs: function(){
      return args;
    },
    isPassed: function(){
      return passed;
    },
    isSkipped: function(){
      return skipped;
    },
    run: function( test, onVerbose, score ){
      var that = this, result = test();
      args = result.arguments;
      if ( !!result.wasSkipped ) {
          skipped = result.wasSkipped;
      } else {
        skipped = false;
        passed = result;
      }
      that.log( onVerbose, score );
    },
    lastResult: function(){
      return currentLog;
    },
    log: function( verbose, score ){
      var kind,
          shouldView = false;
      if ( skipped ) {
        kind = 'skipped';
        score.countUpSkipped();
      } else if ( passed ){
        kind = 'passed';
        score.countUpPassed();
      } else {
        kind = 'faild';
        score.countUpFailure();
        shouldView = true;
      }
      currentLog = marks[ kind ] + " ( " + map( function( a ){
        if ( typeof a == 'string' ){
          return '"' + a + '"';
        }
        return a;
      }, args ).join(', ') + ' )';
      if ( verbose || shouldView ){
        if ( console && console.log ) console.log( currentLog );
      }
    }
  });
  return new Checker();
})();


var TestView = (function(){
  var TestView = function(){},
      for_web,
      instance;

  for_web = {
    getTestCount: function(){
      return parseInt( document.getElementById( 'test-count' ).value, 10 );
    },
    writeMsg: function( msg ){
      var board = document.querySelector( '#test-control .message' ),
          textNode = document.createTextNode( msg );
      board.appendChild( textNode );
    },
    clearMsg: function( ){
      var board = document.querySelector( '#test-control .message' );
      clearNode( board );
    },
    putLog: function( log, withEscape ){
      var consoleLine = document.querySelector( '#logger .log-line' ),
          str = !withEscape ? log : htmlEscape( log );
      consoleLine.innerHTML += str;
    },
    clearLog: function( ){
      var consoleLine = document.querySelector( '#logger .log-line' );
      consoleLine.innerHTML = '';
    },
    highlightMsg: function( isGreen, msg ){
      return '<span class="' + ( isGreen ? 'passed' : 'failed' ) + '">' + msg + '</span><br>';
    }
  };

  createSingleton( TestView, for_web );

  return new TestView();
})();

var Macchiato = (function(){
  var Macchiato = function(){},
      view = TestView,
      suites = [];

  var check = function( label, property ){
    var i = 0,
        l = view.getTestCount(),
        allPassed = true,
        result,
        msg = '';
    for ( ; i < l; i++ ){
      Checker.run( property, verbose, Score );
      if( verbose ) {
        msg += Checker.lastResult() + '<br>';
      }
      Seed.grow();
    }
    result = Score.evaluate();
    msg += view.highlightMsg( result.ok, label + ' : ' + result.message );
    allPassed = allPassed && result.ok;
    Score.clear();
    Seed.clear();
    return {
      passed: allPassed,
      message: msg
    };
  };

  createSingleton( Macchiato, {
    stock: function( p ){
      suites.push( p );
    },
    check: function( ){
      var passed = true,
          i = 0,
          l = suites.length,
          log = '',
          msg = '',
          test,
          label,
          result;

      view.clearMsg();
      view.clearLog();

      for ( ; i < l; i++){
        for ( label in suites[ i ] ){
          test = suites[ i ][ label ];
          result = check( label, test );
          passed = passed && result.passed;
          log += result.message;
        }
      }

      msg = passed ? 'Ok, All tests succeeded!!' : 'Oops! failed test exist...';
      view.putLog( log );
      view.writeMsg( msg );
    }
  });

  return new Macchiato();

})();
