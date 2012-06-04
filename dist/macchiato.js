// Utility

var force = function( promise ){
  return promise();
};

var is_list = function( obj ) {
  var i = 0,
      classes = [ Array, NodeList, HTMLCollection ],
      l = classes.length;

  for ( ; i < l; i++ ){
    if ( obj instanceof classes[ i ] ){
      return true;
    }
  }

  return false;
};

var is_empty = function( obj ){
  var _;
  for ( _ in obj ){
    return false;
  }
  return true;
};

var map = function( callback, elements ){
  var i = 0,
      l,
      result,
      put;

  put = function( index ){
    result[ index ] = callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    result = [];
    l = elements.length;
    for ( ; i < l; i++ ){
      put( i );
    }
  } else {
    result = {};
    for ( i in xs ){
      if ( xs.hasOwnProperty( i ) ){
        put( i );
      }
    }
  }

  return result;
};

var each = function( callback, elements ){
  var i = 0,
      l,
      call;

  call = function( index ){
    callback( elements[ index ], index );
  };

  if ( is_list( elements ) ){
    l = elements.length;
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

var filter = function( callback, elements ){
  var i = 0,
      l = elements.length,
      r = [],
      x;
  for ( ; i < l; i++ ){
    x = elements[ i ];
    if ( callback( x, i ) ){
      r.push( x );
    }
  }
  return r;
};

var createSingleton = function( obj, methods ){
  obj.prototype = methods;
  return new obj();
};


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

var Score = (function(){
  var Score = function(){},
      passed  = 0,
      failure = 0,
      skipped = 0;

  return createSingleton( Score, {
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
})();

var Seed = (function(){
  var Seed = function(){}, value = 1, instance;
  instance = createSingleton( Seed, {
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
  return instance;
})();


var Combinator = (function(){
  var Combinator = function(){}, instance;

  instance = createSingleton( Combinator, {
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

  return instance;
})();


var quadratic = function( a, _b, _c ){
  var b = _b || 1, c = _c || 0;
  return function( x, r ){
    return a * Math.pow( x, 2 ) + b * x + c;
  };
};

var GenerateRefference = (function(){
  var GenerateRefference = function(){}, method, C = Combinator, instance;

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

  instance = createSingleton( GenerateRefference, method );

  return instance;
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

  return createSingleton( Checker, {
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
          br = document.createElement('br');
      if ( log instanceof HTMLElement ){
        consoleLine.appendChild( log );
      } else {
        var str = !withEscape ? log : htmlEscape( log ),
            textNode = document.createTextNode( str );
        consoleLine.appendChild( textNode );
      }
      consoleLine.appendChild( br );
    },
    clearLog: function( ){
      var consoleLine = document.querySelector( '#logger .log-line' );
      clearNode( consoleLine );
    },
    highlightMsg: function( isGreen, msg, placeholder ){
      var dom = document.createElement( 'span' ),
          textNode = document.createTextNode( msg );
      dom.setAttribute('class', ( isGreen ? 'passed' : 'failed' ));
      dom.appendChild( textNode );
      return dom;
    }
  };

  instance = createSingleton( TestView, for_web );

  return instance;
})();

var Macchiato = (function(){
  var Macchiato = function(){}, view = TestView, instance, suites = [], check;

  check = function( label, property ){
    var i = 0, l = view.getTestCount(), allPassed = true, result, msg;
    while ( i++ < l ){
      Checker.run( property, verbose, Score );
      if( verbose ) view.putLog( Checker.lastResult() );
      Seed.grow();
    }
    result = Score.evaluate();
    msg = view.highlightMsg( result.ok, label + ' : ' + result.message );
    allPassed = allPassed && result.ok;
    view.putLog( msg );
    Score.clear();
    Seed.clear();
    return allPassed;
  };

  instance = createSingleton( Macchiato, {
    stock: function( p ){
      suites.push( p );
    },
    check: function( ){
      var passed = true, msg;
      view.clearMsg();
      view.clearLog();

      each( function( tests ){
        each( function( test, label ){
          passed = passed && check( label, test );
        }, tests );
      }, suites );

      msg = passed ? 'Ok, All tests succeeded!!' : 'Oops! failed test exist...';
      view.writeMsg( msg );
    }
  });

  return instance;

})();
