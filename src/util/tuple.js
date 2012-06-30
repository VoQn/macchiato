
/**
 * @param {*} fst
 * @param {*} snd
 * @constructor
 */
var Tuple = function Tuple(fst, snd) {
  this.fst = fst;
  this.snd = snd;
};

/**
 * @param {*} a
 * @param {*} b
 * @return {Tuple}
 */
var tuple = function (a, b) {
  return new Tuple(a, b);
};

/**
 * @param {Tuple} tpl
 * @return {*}
 */
var first = function (tpl) {
  return tpl.fst;
};

/**
 * @param {Tuple} tpl
 * @return {*}
 */
var second = function (tpl) {
  return tpl.snd;
};

/**
 * @param {Array.<Tuple>} tpls
 * @return {Array}
 */
var heads = function (tpls) {
  return map(first, tpls);
};

/**
 * @param {Array.<Tuple>} tpls
 * @return {Array}
 */
var tails = function (tpls) {
  return map(second, tpls);
};

