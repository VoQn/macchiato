
/** @constructor */
var Combinator = function Combinator () {};

/** @type {Combinator} */
var combinator = new Combinator();
/**
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.sized = function (generator) {
  var p, v,
      grow = seed.exponent(2, 0.5),
      generate_by_size = function (progress) {
        p = grow(progress);
        v = generator(p);
        return v;
      };
  return generate_by_size;
};

/**
 * @param {function(number):number} grow
 * @param {function(number):*} generator
 * @return {function(number):*}
 */
combinator.resize = function (grow, generator) {
  var p, v,
      generate_with_resize = function(progress){
        p = grow(progress);
        v = generator(p);
        return v;
      };
  return generate_with_resize;
};
/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.choose = function (n1, n2) {
  var value,
      n_min = Math.min(n1, n2),
      n_max = Math.max(n1, n2),
      n = n_max - n_min + 1,
      generate_num = function(){
        value = Math.random() * n + n_min;
        return value;
      },
      generate_int = function(){
        value = Math.floor(Math.random() * n) + n_min;
        return value;
      };
  if (Math.floor(n1) === n1 &&  Math.floor(n2) === n2) { // arguments is Integer
    return generate_int;
  }
  return generate_num;
};

/**
 * @param {number} n1
 * @param {number} n2
 * @return {function():number}
 */
combinator.chooseNow = function (n1, n2) {
  var value,
      n_min = Math.min(n1, n2),
      n_max = Math.max(n1, n2),
      n = n_max - n_min + 1;
  if (Math.floor(n1) === n1 && Math.floor(n2) === n2) {
    value = Math.floor(Math.random() * n) + n_min;
    return value;
  }
  value = Math.random() * n + n_min;
  return value;
};

/**
 * @param {!Array} list
 * @return {function():*}
 */
combinator.elements = function (list) {
  var index,
      max = list.length - 1,
      select = combinator.choose(0, max),
      generate_by_list = function () {
        index = select();
        return list[index];
      };
  return generate_by_list;
};

/**
 * @param {Array.<function():*>} generators
 * @return {function():*}
 */
combinator.oneOf = function (generators) {
  var index, value,
      max = generators.length - 1,
      select = combinator.choose(0, max),
      generate_by_one_of_generators = function (progress) {
        index = select();
        value = generators[index](progress);
        return value;
      };
  return generate_by_one_of_generators;
};

/**
 * @param {function():*} generator
 * @param {(function(Array):*)=} opt_callback
 * @return {function(number):Array}
 */
combinator.listOf = function (generator, opt_callback) {
  var i, l, result,
      generate_array = function (progress) {
        l = Math.random() * progress;
        result = [];
        for (i = 0; i < l; i++ ){
          result[i] = generator(progress);
        }
        return result;
      },
      generate_array_with_option = function (progress) {
        return opt_callback(generate_array(progress));
      };
  if (opt_callback === undefined) {
    return generate_array;
  }
  return generate_array_with_option;
};

/**
 * @param {function():*} generator
 * @return {function(number):Array}
 */
combinator.listOf1 = function (generator) {
  var i, l, length, result,
      generate_non_empty_array = function (progress) {
        l = Math.random() * progress;
        length = l < 1 ? 1 : l;
        result = [];
        for (i = 0; i < length; i++) {
          result[i] = generator(progress);
        }
        return result;
      };
  return generate_non_empty_array;
};

/**
 * @param {number} length
 * @param {function():*} generator
 * @return {function():Array}
 */
combinator.vectorOf = function( length, generator ){
  var i, list,
      generate_fixed_length_array = function(){
        for (i = 0, list = []; i < length; i++) {
          list[i] = generator();
        }
        return list;
      };
  return generate_fixed_length_array;
};

/**
 * @param {Array.<Tuple>} rate_generators
 * @param {(function(*):*)=} opt_callback
 * @return {function(number=):*}
 */
combinator.frequency = function (rated_generators, opt_callback) {
  var i, rate, value, threshold,
      rate_list  = heads(rated_generators),
      l = rate_list.length,
      generators = tails(rated_generators),
      sum        = sumOf(rate_list),
      select     = combinator.choose(1, sum),

      generate_by_frequency = function (progress) {
        threshold = select();

        for (i = 0; i < l; i++) {
          rate = rate_list[i];
          if (threshold < rate) {
            value = generators[i](progress);
            return value;
          }
          threshold -= rate;
        }
        value = generators[l - 1](progress);
        return value;
      },
      generate_by_frequency_with_option = function (progress) {
        return opt_callback(generate_by_frequency(progress));
      };
  if (opt_callback === undefined) {
    return generate_by_frequency;
  }
  return generate_by_frequency_with_option;
};

