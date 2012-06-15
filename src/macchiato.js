
/** @type {Macchiato} */
var macchiato = (function(){
  /** @constructor */
  var Macchiato = function(){};
  /** @type {View} */
  var view = consoleView;
  /** @type {Array.<Object.<string:function>>} */
  var suites = [];

  /** @type {Macchiato} */
  var macchiato = new Macchiato();

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

  macchiato.taste = function( ){
    /** @type {boolean} */
    var passed = true;
    /** @type {number} */
    var index = 0;
    /** @type {Object.<string, function>} */
    var suite;
    /** @type {string} */
    var label = '';
    /** @type {function} */
    var property;
    /**
     * @param {string} label
     * @param {function():(boolean|Object)} property
     * @return {boolean}
     */
    var check = function( label, property ){
      /** @type {boolean} */
      var verbose = view.verbose;
      /** @type {number} */
      var count = view.getTestCount();
      /** @type {boolean} */
      var allPassed = true;

      var result;

      for ( ; count; count-- ){
        checker.run( property, verbose, score );
        if( verbose ) {
          view.putLog( checker.lastResult(), true );
        }
        seed.grow();
      }

      result = score.evaluate();
      view.putLog( view.highlight( result.ok, label + ' : ' + result.message ));
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

    // this.view.clean();
    return this;
  };

  return macchiato;
})();
