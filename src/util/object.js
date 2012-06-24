// Object control utilities

/**
 * @param {!Object} object
 * @return {boolean} parameter is empty or not
 */
var isEmpty = function (object) {
  return object === null ||
         object === undefined ||
         Object.keys(object).length === 0;
};

/**
 * @description Object clone
 * @param {!Object} object
 * @return {Object}
 */
var clone = function (object) {
  var copied = Object.create(Object.getPrototypeOf(object)),
      properties = Object.getOwnPropertyNames(object),
      index, length,
      name;
  for (index = 0, length = properties.length; index < length; index++) {
    name = properties[index];
    Object.defineProperty(copied,
                          name,
                          Object.getOwnPropertyDescriptor(object, name));
  }
  return copied;
};

/**
 * @param {Object} default_value
 * @param {Object=} opt_arg
 * @param {(function(Object, Object):Object)=} opt_callback
 * @return {Object}
 */
var supplement = function (default_value, opt_arg, opt_callback) {
  var result;
  if (opt_arg === undefined) {
    result = default_value;
  } else if (opt_callback === undefined) {
    result = opt_arg;
  } else {
    result = opt_callback(default_value, opt_arg);
  }
  return result;
};

/**
 * @param {*} args has "length" property
 * @param {number=} opt_from
 * @param {number=} opt_to
 * @return {Array}
 */
var asArray = function (args, opt_sub, opt_to) {
  var from = supplement(0, opt_sub),
      to   = supplement(args.length || 1, opt_to),
      result;
  if (args.length === undefined) {
    result = [args];
  } else {
    result = Array.prototype.slice.call(args, from, to);
  }
  return result;
};

