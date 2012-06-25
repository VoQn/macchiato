
/** @type {Interface} */
var ViewInterface = new Interface('ViewInterface', [
    'getTestCount',
    'standby',
    'clean',
    'putMsg',
    'putLog',
    'dump',
    'highlight'
    ]);

/**
 * @description Tester View
 * @constructor
 */
var View = function View () {};

/**
 * @enum {string}
 */
View.LOG_MODE = {
  VERBOSE: 'verbose',
  PROPERTY_RESULT: 'property',
  TOTAL: 'total'
};

/**
 * @param {Object} stub
 * @return {View}
 */
var createView = function (stub) {
  var i, l,
      keys = Object.keys(stub),
      view = new View();

  for (i = 0, l = keys.length; i < l; i++) {
    key = keys[i];
    view[key] = stub[key];
  }
  Interface.ensureImplements(view, ViewInterface);
  return view;
};

