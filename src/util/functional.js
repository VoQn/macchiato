// FUnctional programming utilities

/**
 * @param {function() : *} promise
 * @return {*}
 */
var force = function (promise) {
  return promise();
};

/**
 * @param {function(*, *):*} func
 * @return {function(*, *):*}
 */
var flip = function (func) {
  var reversed = function (b, a) {
        return func(a, b);
      };
  return reversed;
};

var apply = function (arg) {
  var application = function (func) {
        return func(arg);
      };
  return application;
};

var applies = function (arg, var_args) {
  var args = asArray(arguments),
      application = function (func) {
        return func.call(null, args);
      };
  return application;
};

/**
 * @param {function()} func
 * @param {...(*)} var_args
 * @return {*}
 */
var curry = function (func, var_args) {
  var length = func.length,
      args = arguments.length < 2 ? [] : asArray(arguments, 1),
      curried = function () {
        var appended = args.concat(asArray(arguments));
        return curry.apply(null, [func].concat(appended));
      };

  if (length <= args.length) {
    return func.apply(null, args);
  }
  return curried;
};

