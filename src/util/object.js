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
  var i, l, name,
      copied = Object.create(Object.getPrototypeOf(object)),
      properties = Object.getOwnPropertyNames(object);

  for (i = 0, l = properties.length; i < l; i++) {
    name = properties[i];
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
  if (opt_arg === undefined) {
    return default_value;
  }
  if (opt_callback === undefined) {
    return opt_arg;
  }
  return opt_callback(default_value, opt_arg);
};

/**
 * @param {*} args has "length" property
 * @param {number=} opt_from
 * @param {number=} opt_to
 * @return {Array}
 */
var asArray = function (args, opt_sub, opt_to) {
  var from = supplement(0, opt_sub),
      to   = supplement(args.length || 1, opt_to);

  if (args.length === undefined) {
    return [args];
  }
  return Array.prototype.slice.call(args, from, to);
};

