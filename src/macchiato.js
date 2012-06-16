
var macchiato = (function(){
  /** @constructor */
  var Macchiato = function(){},
      /** @type {Macchiato} */
      macchiato = new Macchiato(),
      /** @type {View} */
      view = consoleView,
      /** @type {Array} */
      suites = [];

  /**
   * @param {boolean} verbose
   * @return {Macchiato}
   */
  macchiato.setVerbose = function( verbose ){
    view.verbose = verbose;
    return this;
  };

  /**
   * @param {View} view_
   * @return {Macchiato}
   */
  macchiato.setView = function( view_ ){
    Interface.ensureImplements( view_, ViewInterface );
    view = view_;
    return this;
  };

  /**
   * @param {Object.<string, function():(boolean|Object)>} labeledProperties
   * @return {Macchiato}
   */
  macchiato.stock = function( labeledProperties ){
    suites.push( labeledProperties );
    return this;
  };

  macchiato.taste = function(){
    var passed = true,
        index = 0,
        suite,
        label = '',
        property,
        /**
         * @param {string} label
         * @param {function():(boolean|Object)} property
         * @return {boolean}
         */
        check = function( label, property ){
          var verbose = view.verbose,
              count = view.getTestCount(),
              allPassed = true,
              msg = '',
              result;
          for ( ; count; count-- ){
            checker.run( property, verbose, score );
            if( verbose || checker.shouldView ) {
              view.putLog( checker.currentLog, true );
            }
            seed.grow();
          }
          result = score.evaluate();
          msg = label + ' : ' + result.message;
          view.putLog( view.highlight( result.ok, msg ));
          allPassed = allPassed && result.ok;
          score.clear();
          seed.clear();
          return allPassed;
        };
    view.standby();
    for ( ; suite = suites[ index ]; index++){
      for ( label in suite ){
        property = suite[ label ];
        passed = passed && check( label, property );
      }
    }
    view.dump();
    view.putMsg( passed ?
        'Ok, All tests succeeded!!' :
        'Oops! failed test exist...' );

    return this;
  };
  return macchiato;
})();
