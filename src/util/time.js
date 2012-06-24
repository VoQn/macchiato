
/**
 * @description getCurrent Unix time
 * @return {number}
 */
var whatTimeIsNow = function () {
  return new Date().getTime();
};

/**
 * @description pretty print for time span
 * @param {number} from
 * @param {number=} opt_to
 * @return {string}
 */
var printTime = function (from, opt_to) {
  var to = supplement(whatTimeIsNow(), opt_to),
      diff = to - from,
      expr;
  if (diff > 6e4) {
    expr = diff / 6e4 + 'min';
  } else if (diff > 1e3) {
    expr = diff / 1e3 + 's';
  } else {
    expr = diff + 'ms';
  }
  return expr;
};

