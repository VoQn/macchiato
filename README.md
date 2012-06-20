# Macchiato.js - BDD + QDD testing framework for JavaScript -
**Macchiato** is testing framework for JavaScript, inspired by [QuickCheck](http://hackage.haskell.org/package/QuickCheck-2.4.2), a similar library for [Haskell](http://www.haskell.org/) programs.

## About [QuickCheck](http://hackage.haskell.org/package/QuickCheck-2.4.2)
_from [QuickCheck module description](http://hackage.haskell.org/package/QuickCheck-2.4.2)_

> QuickCheck is a library for random testing of program properties.
> 
> The programmer provides a specification of the program, in the form of properties which functions should satisfy, and QuickCheck then tests that the properties hold in a large number of randomly generated cases.
> 
> Specifications are expressed in Haskell, using combinators defined in the QuickCheck library. QuickCheck provides combinators to define properties, observe the distribution of test data, and define test data generators.

## Demo page
see [voqn.github.com/macchiato/](http://voqn.github.com/macchiato/)

## Sorry. now Macchiato.js is under development
please see [GitHub Milestones](https://github.com/VoQn/macchiato/issues/milestones/)

## Sample code
### Register test suites
Use `macchiato.stock( labeled_properties )`

``` {.javascript}
macchiato.stock({ // stock test properties as object
    'number x, y => x + y === y + x' : // <label>:<callback>
          arbitrary( 'number', 'number' ).property( function( x, y ){
              return x + y === y + x; // boolean
          })
}).taste(); // run all stocked test suites
```

in default, macchiato.js generate 100 pattern argument per test-property.

### Run Test Suites
Use `macchiato.taste()`

```javascript
macchiato.taste(); // check all test quite. and display test result
```

### Use adhoc generation
Use `arbitrary( type_signature ).fmap( modifier_callback )`
```javascript
// Non Negative Integer generator
arbitrary('integer').fmap( function( n ){
  return Math.abs( n );
}).property( function( x ){
  return x > -1;
});
```

### Register User generator
Use `arbitrary( type_signature ).recipe( generator_callback )`

```javascript
arbitrary('fizzbuzz').recipe( arbitrary( 'integer' ).fmap( function( n ){
        var x = Math.max( Math.abs( n ), 1 );
        return x % 15 == 0 ? 'FizzBuzz' : x % 5 == 0 ? 'Buzz' : x % 3 == 0 ? 'Fizz' : x;
    });
});
```

### How to see generator works
Use `arbitrary.sample( optional_count )`

``` {.javascript}
arbitrary( 'boolean' ).sample( 5 ); // [ true, false, false, true, true ]
arbitrary( 'boolean' ).sample( 5 ); // [ false, false, true, false, true ]
arbitrary( 'number' ).sample(); // in default, return array has 10 elements
```
