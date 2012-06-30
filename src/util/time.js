
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
      ms = to - from;
  if (ms > 6e4) {
    return ms / 6e4 + 'min';
  }
  if (ms > 1e3) {
    return ms / 1e3 + 's';
  }
  return ms + 'ms';
};

