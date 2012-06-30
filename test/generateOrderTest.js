
// 'use strict';

var label = '[(number, number) -> (x,y)] => commutative between 2 numbers';

// regexp for generate order
var comma = /\s*,\s*/,
    multiParam = /^\s*\(\s*(\w+(,\s*\w+\s*)+)(?=\s*\))$/,
    singleParam = /^\s*\(\s*(\w+)(?=\s*\))$/;

var v_d = label.split(/\s*=>\s*/),
    value_expr = v_d[0].match(/\[\s*(.*)(?=\s*\])/)[1],
    description = v_d[1].match(/\s*(.*)(?=\s*)/)[1],

    t_p = value_expr.split(/\s*\->\s*/),
    isMultiParam = t_p[0].match(multiParam);

var type_exprs, param_exprs;

var util = require('util');

function isPrimitive(x) {
  var t = typeof x, ts = ['undefined', 'null', 'boolean', 'number', 'string'],
      i, l;
  for (i = 0, l = ts.length; i < l; i++) {
    if (t === ts[i]) {
       return true;
    }
  }
  return false;
}

function deepEq(a, b) {
  var i, l, a_ps, b_ps;
  function replaceSpaces(expr) {
    return expr.replace(/\s*\{\s*/,
             ' { ').replace(/\s*\}\s*/,
             ' }').replace(/\s*,\s*/,
             ', ').replace(/\s*;\s*/,
             '; ').replace(/\s+/, ' ');
  }
  // Primitive
  if (isPrimitive(a) && isPrimitive(b)) {
    return a === b;
  }
  // Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length === b.length) {
      for (i = 0, l = a.length; i < l; i++){
        if (!deepEq(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  // Function
  if (typeof a === 'function' && typeof b === 'function') {
    if (a.name !== b.name || a.length !== b.length) {
      return false;
    }
    return replaceSpaces(a.toString()) === replaceSpaces(b.toString());
  }
  // Object
  if (a.constructor === b.constructor) {
    a_ps = Object.getOwnPropertyNames(a);
    b_ps = Object.getOwnPropertyNames(b);
    if (a_ps.length !== b_ps.length) {
      return false;
    }
    for (i = 0, l = a_ps.length; i < l; i++) {
      if (!deepEq(a[a_ps[i]], b[b_ps[i]])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

exports.deepEq = deepEq;

function isSameArray(a, b) {
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    var i, l = a.length;
    for (i = 0; i < l; i++) {
      if (!(a[i] === b[i] || isSameArray(a[i], b[i]))) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function test(expect, actual) {
  var eq = deepEq(expect,actual),
      label = '(' + util.inspect(expect) +
              ', ' + util.inspect(actual) +
              ')\u001b[0m',
      prefix = eq ? '\u001b[32m\u2713 ' : '\u001b[31m\u2718 ';
  console.log(prefix + label);
}

function seq(f, s) {
  return s;
}

function parseError(message) {
  return new Error('ParseError' + (message ? (': ' + message) : ''));
}

function splitComma(expr) {
  return expr.split(comma);
}

function splitByArrow(expr, next) {
  var splited = expr.split(/\s*->\s*/);
  return next ? next(null, splited) : splited;
}

function makeRegMatch(re) {
  var test = function (expr, next) {
    var try_parsed = expr.match(re), 
        error = parseError(expr);
    if (try_parsed && try_parsed.length > 1) {
      return next ? next(null, try_parsed[1]) : try_parsed[1];
    }
    if (next) {
      return next(error);
    }
    throw error;
  };
  return test;
}

var fromWrapParen = makeRegMatch(/\(\s*(.*)(?=\s*\))/);
var fromWrapBlock = makeRegMatch(/\[\s*(.*)(?=\s*\])/);

test(splitComma('number, number'), ['number','number']);

test(splitByArrow('(number, number) -> (x, y)'),
    ['(number, number)', '(x, y)']);

test(fromWrapParen('(number, number)', seq),
      'number, number');

test(fromWrapParen('(number, number)', function(e, v) {
        return splitComma(v);
     }),
     ['number', 'number']);

test(fromWrapParen('(number)', function(e, v) {
        return splitComma(v);
     }),
     ['number']);

test(splitByArrow('(number, number) -> (x, y)', function (e, vs) {
        var get = function (v1) {
          return fromWrapParen(v1, function(e, v2){
            return splitComma(v2);
          });
        };
        return [get(vs[0]), get(vs[1])];
     }),
     [['number', 'number'], ['x', 'y']]);

test(fromWrapBlock('[(number, number) -> (x, y), x !== y]', function(e, v1) {
       var rmParenAndSpComma = function (v) {
         return fromWrapParen(v, function(e, v2) {
            return splitComma(v2);
         });
       };
       return splitByArrow(v1, function(e, v2) {
           var t = rmParenAndSpComma(v2[0]), ve = v2[1];
           var ves = splitComma(ve), vs, c, cs, cond;
           if (ves.length > 1) {
             cs = ves.slice(2);
             c = 'return function ' + [ves[0],ves[1]].join(', ') +
                 ' { return ' + cs.join(' && ') + ';}';
             cond = new Function(c);
           }
           vs = rmParenAndSpComma([ves[0],ves[1]].join(', '));
           return {
             types: t,
             values: vs,
             cond: cond()
           };
       });
     }),
     { types: ['number', 'number'],
       values: ['x', 'y'],
       cond: function (x, y) {
         return x !== y;
       }
     });

