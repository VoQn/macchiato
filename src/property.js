// functional property - test generator
/**
 * @param {string} label
 * @return {function(number):*}
 */
var parsePropertyDescription = function (label) {
  'use strict';
  var reComma = /\s*,\s*/,
      reMultiParam = /^\s*\(\s*(\w+(,\s*\w+\s*)+)(?=\s*\))$/,
      reSingleParam = /^\s*\(\s*(\w+)(?=\s*\))$/;
  var v_d = label.split(/\s*=>\s*/);
  var value_expr = v_d[0].match(/\[\s*(.*)(?=\s*\])/)[1];
  var t_p = value_expr.split(/\s*\->\s*/);
  var type_exprs, param_exprs;

  var isMultiParam = t_p[0].match(reMultiParam);
  if (isMultiParam) {
    // multi parameters
    type_exprs = t_p[0].match(reMultiParam)[1].split(reComma);
  } else {
    // single parameters
    type_exprs = [t_p[0].match(reSingleParam)[1]];
  }

  var description = v_d[1].match(/\s*(.*)(?=\s*)/)[1];
  var parameterGenerator = function (progress) {
      };
  return parameterGenerator;
};

/**
 * @param {string} description
 * @param {function(...*):boolean} assertion
 */
var property = function (description, assertion) {
  var generator = parsePropertyDescription(description),
      testCallback = function () {
      };
  return testCallback;
};
