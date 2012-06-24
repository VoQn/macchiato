/**
 * @param {string} type_str
 * @param {...string} var_args
 * @constructor
 */
var arbitrary = function (type_str, var_args) {
  var args = asArray(arguments);
  return new arbitrary.fn.init(args);
};

/**
 * @type {arbitrary}
 */
arbitrary.fn = arbitrary.prototype = (function () {
  var r_list = /\[\s?([a-z]+)\s?\]/,
      /**
       * @param {string} t
       * @return {function():Object}
       */
      select_generator = function (type_expr) {
        /** @type {?Array.<string>} */
        var test = r_list.exec(type_expr),
            listOf = combinator.listOf,
            generator;
        if (!!test) {
          generator = generateReference[test[1]];
          return listOf(generator);
        }
        generator = generateReference[type_expr];
        return generator;
      },
      register_adhoc = function (adhoc_type, generator) {
        return generateReference.register(adhoc_type, generator);
      };

  return {
    constructor: arbitrary,
    /**
     * @param {!Array.<string>} types
     * @constructor
     */
    init: function (types) {
      this.length = types.length;
      this.types = types;
      return this;
    },
    /** @type {Array.<string>} */
    types: [],
    length: 0,
    /**
     * @return {number}
     */
    size: function () {
      return this.length;
    },
    /**
     * @param {function(Object, ...Object):(boolean|{wasSkipped:boolean})}
     * @return {function():Result}
     */
    property: function (property) {
      var generators,
          index = 0,
          types = this.types,
          length = types.length;
      try {
        generators = map(select_generator, types);
      } catch (error) {
        if (console && console.log) {
          console.log(error);
        }
      }
      return forAll(generators, property);
    },
    recipe: function (generator) {
      if (this.length === 1 && generator.constructor === arbitrary) {
        generateReference.register(
          this.types[0],
          generateReference[generator.types]);
      }
      // FIXME adhock implementation
      if (this.length === 1 && typeof generator === 'function') {
        generateReference.register(this.types[0], generator);
        return;
      }
      if (arguments.length === 1 && typeof arguments === 'object') {
        generateReference.register(generator);
      }
    },
    recipeAs: function(new_type_signature){
      generateReference.register(
        new_type_signature,
        generateReference[this.types[0]]);
      return arbitrary(new_type_signature);
    },
    fmap: function (addtional) {
      var types = this.types,
          generators = map(select_generator, types),
          apply_progress,
          adhoc = function (progress) {
            apply_progress = apply(progress);
            var values = map(apply_progress, generators);
            return addtional.apply(null, values);
          },
          new_type = 'adhock_' + addtional.name + whatTimeIsNow() +
                      '_(' + types.join(', ') + ')';
      register_adhoc(new_type, adhoc);
      return arbitrary.call(null, new_type);
    },
    /**
     * @param {number=} opt_count
     * @return {Array}
     */
    sample: function (opt_count) {
      var i, generators, values, apply_progress,
          fix = function (x, o) {
            return Math.max(1, o);
          },
          count = supplement(10, opt_count, fix),
          types = this.types,
          result = [];

      try {
        generators = map(select_generator, types);
      } catch (e) {
        if (console && console.log){
          console.log(e);
        }
      }
      for (i = 0; i < count; i++) {
        apply_progress = apply(i);
        values = map(apply_progress, generators);
        if (console && console.log){
          console.log(values.length === 1 ? values[0] : values);
        }
        result.push(values);
      }
      return result;
    }
  };
})();

arbitrary.fn.init.prototype = arbitrary.fn;

