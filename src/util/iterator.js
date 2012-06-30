// List iteration utilities

/**
 * @description instead of Array.isArray
 * @param {!Array|!Object} object
 * @return {boolean} parameter is kind of list or not
 */
var isList;
if ( !!Array.isArray ){
  isList = Array.isArray;
} else {
  isList = function( object ){
    return Object.prototype.toString.call( object ) === '[object Array]';
  };
}

/**
 * @param {function(*, number=)} callback
 * @param {!Array} elements
 * @return {Array} new array or object
 */
var map = function (callback, elements) {
  var i, l,
      new_array = [];

  for (i = 0, l = elements.length; i < l; i++) {
    new_array[i] = callback(elements[i], i);
  }
  return new_array;
};

/**
 * @param {function(*, string=):*} callback
 * @param {!Object} object
 * @return {Object}
 */
var modify = function (callback, object) {
  var i, l, key,
      new_object = clone(object),
      keys = Object.getOwnPropertyNames(new_object);

  for (i = 0, l = keys.length; i < l; i++) {
    key = keys[i];
    new_object[key] = callback(new_object[key], key);
  }
  return new_object;
};

/**
 * @param {function(*, number=)} callback
 * @param {!Array} elements
 */
var each = function (callback, elements) {
  var i, l;

  for (i = 0, l = elements.length; i < l; i++) {
    callback(elements[i], i);
  }
};

/**
 * @param {function(*, string=)} callback
 * @param {!Object} object
 */
var eachKeys = function (callback, object) {
  var i, l, key,
      keys = Object.getOwnPropertyNames(object);

  for (i = 0, l = keys.length; i < l; i++) {
    key = keys[i];
    callback(object[key], key);
  }
};

/**
 * @param {function(*, number=): boolean} callback
 * @param {!Array} elements
 * @return {Array} new array list
 */
var filter = function (callback, elements) {
  var i, j, l, e,
      result = [];

  for (i = 0, j = 0, l = elements.length; i < l; i++) {
    e = elements[i];
    if (callback(e, i)) {
      result[j] = e;
      j++;
    }
  }

  return result;
};

/**
 * @param {function(*, number=):boolean} test
 * @param {!Array} elements
 * @return {boolean}
 */
var hasAny = function (test, elements) {
  var i, l;

  for (i = 0, l = elements.length; i < l; i++) {
    if (test(elements[i], i)) {
      return true;
    }
  }
  return false;
};

/**
 * @param {function(*, number=):boolean} test
 * @param {!Array} elements
 * @return {boolean}
 */
var hasAll = function (test, elements) {
  var i, l;

  for (i = 0, l = elements.length; i < l; i++) {
    if (!test(elements[i], i)) {
      return false;
    }
  }
  return true;
};

/**
 * @param {*} init
 * @param {function(*, *):*} collector
 * @param {!Array} elements
 * @return {*}
 */
var foldLeft = function (init, collector, elements) {
  var i, l,
      result = init;

  for (i = 0, l = elements.length; i < l; i++) {
    result = collector(elements[i], result);
  }
  return result;
};

/**
 * @param {*} init
 * @param {function(*, *):*} collector
 * @param {!Array} elements
 * @return {*}
 */
var foldRight = function (init, collector, elements) {
  var i, l,
      result = init;

  for (i = elements.length - 1, l = -1; i > l; i--) {
    result = collector(elements[i], result);
  }
  return result;
};

/**
 * @description sum of number array
 * <pre><code>arbitrary( '[number]' ).property( function( numbers ){
 *   var add = function( a, b ){ return a + b; };
 *   return sumOf( numbers ) === foldLeft( 0, add, numbers );
 * }</code></pre>
 * @param {!Array.<number>} numbers
 * @return {number}
 */
var sumOf = function (numbers) {
  var i, l,
      result = 0;

  for (i = 0, l = numbers.length; i < l; i++) {
    result += numbers[i];
  }
  return result;
};

