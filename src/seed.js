
/** @constructor */
var Seed = function Seed() {};

/** @type {Seed} */
var seed = new Seed();

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @return {function(number):number}
 */
seed.linear = function (opt_a, opt_b) {
  var a = supplement(1, opt_a, Math.max),
      b = supplement(0, opt_b),
      calc_linear = function (x) {
        return a * x + b;
      };
  return calc_linear;
};

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @param {number=} opt_c
 * @return {function(number):number}
 */
seed.quadratic = function (opt_a, opt_b, opt_c) {
  var a = supplement(1, opt_a),
      b = supplement(0, opt_b),
      c = supplement(0, opt_c),
      calc_quadratic = function (x) {
        return a * x * x + b * x + c;
      };
  return calc_quadratic;
};

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @return {function(number):number}
 */
seed.exponent = function (opt_a, opt_b) {
  var a = supplement(2, opt_a, Math.max),
      b = supplement(1, opt_b),
      calc_exponent = function (x) {
        return Math.pow(a, (Math.round(x * b)));
      };
  return calc_exponent;
};

/**
 * @param {number=} opt_a
 * @param {number=} opt_b
 * @param {number=} opt_c
 * @return {function(number):number}
 */
seed.logarithm = function (opt_a, opt_b, opt_c) {
  var a = supplement(1, opt_a),
      b = supplement(2, opt_b, Math.max),
      c = supplement(0, opt_c),
      calc_logarithm = function (x) {
        return Math.log(x * a) / Math.log(b) + c;
      };
  return calc_logarithm;
};

