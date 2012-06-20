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
macchiato.taste(); // check all stocked test quite. and display test result
```

### How to see generator works
Use `arbitrary.sample( opt_count )`

``` {.javascript}
arbitrary( 'boolean' ).sample( 5 ); // [ true, false, false, true, true ]
arbitrary( 'boolean' ).sample( 5 ); // [ false, false, true, false, true ]

// in default, return array has 10 elements
arbitrary( 'number' ).sample(); // [ 0,0,3.3664272732128677,-0.08306895613589656,8.754622973563311,1.1898821511922015,0.27250861726806175,-1969.388762412214,53.54628693512971,0.8624822175133743 ]
```

### Use adhoc new type generator
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
arbitrary( 'hoge' ).recipe(
  combinrator.elements( ['hoge', 'huga', 'foo', 'bar'] )
);
```

Or, `arbitrary( type_signature ).recipeAs( new_type_signature )`
```javascript
arbitrary( 'integer' ).fmap( function( n ){
  var x = Math.max( Math.abs( n ), 1 );
  return x % 15 == 0 ? 'FizzBuzz' : x % 5 == 0 ? 'Buzz' : x % 3 == 0 ? 'Fizz' : x;
}).recipeAs( 'fizzbuzz' );
```

