
/** @type {Macchiato} */
var macchiato = (function(){
  /** @constructor */
  var Macchiato = function(){
    /** @type {View} */
    this.view = consoleView;
    /** @type {Array.<Object.<string:function>>} */
    this.suites = [];
  };

  /** @type {Macchiato} */
  var macchiato = new Macchiato();

  /**
   * @param {string} label
   * @param {function} property
   * @return {boolean}
   */
  var check = function( label, property ){
    /** @type {number} */
    var index = 0;
    /** @type {View} */
    var view = macchiato.view;
    /** @type {boolean} */
    var verbose = view.verbose;
    /** @type {number} */
    var count = view.getTestCount();
    /** @type {boolean} */
    var allPassed = true;

    var result;

    for ( ; index < count; index++ ){
      checker.run( property, verbose, score );
      if( view.verbose ) {
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

  /**
   * @param {boolean} verbose
   * @return {Macchiato}
   */
  macchiato.setVerbose = function( verbose ){
    this.view.verbose = verbose;
    return this;
  };

  /**
   * @param {View} view
   * @return {Macchiato}
   */
  macchiato.setView = function( view ){
    Interface.ensureImplements( view, ViewInterface );
    this.view = view;
    return this;
  };

  /**
   * @param {Object.<string, function>} labeledProperties
   * @return {Macchiato}
   */
  macchiato.stock = function( labeledProperties ){
    this.suites.push( labeledProperties );
    return this;
  };

  macchiato.taste = function( ){
    /** @type {boolean} */
    var passed = true;
    /** @type {number} */
    var index = 0;
    /** @type {Array.<Object.<string, function>>} */
    var suites = this.suites;
    /** @type {number} */
    var length = suites.length;
    /** @type {string} */
    var label = '';
    /** @type {function} */
    var property;

    this.view.standby();

    for ( ; index < length; index++){
      for ( label in suites[ index ] ){
        property = suites[ index ][ label ];
        passed = passed && check( label, property );
      }
    }

    this.view.dump();
    this.view.putMsg( passed ?
        'Ok, All tests succeeded!!' :
        'Oops! failed test exist...' );

    this.view.clean();
    return this;
  };

  return macchiato;
})();
