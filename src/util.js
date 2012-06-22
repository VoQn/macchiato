// Utilities

/**
 * @param {*} fst
 * @param {*} snd
 * @constructor
 */
var Tuple = function Tuple ( fst, snd ){
  this.fst = fst;
  this.snd = snd;
};

/**
 * @param {*} a
 * @param {*} b
 * @return {Tuple}
 */
var tuple = function( a, b ){
  return new Tuple( a, b );
};

/**
 * @description getCurrent Unix time
 * @return {number}
 */
var whatTimeIsNow = function(){
  return new Date().getTime();
};

/**
 * @description pretty print for time span
 * @param {number} from
 * @param {number=} opt_to
 * @return {string}
 */
var printTime = function( from, opt_to ){
  var to = supplement( whatTimeIsNow(), opt_to ),
      time = to - from;
  if ( time > 6e4 ){
    return time / 6e4 + 'min';
  } else if ( time > 1e3 ){
    return time / 1e3 + 's';
  }
  return time + 'ms';
};

