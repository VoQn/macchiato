// user's tests
Macchiato.stock({
  'number x, y => x + y == y + x' : prop(
    arbitrary( 'number', 'number' )
    , function( x, y ){
        return x + y == y + x;
  }),
  'string str => str == true' : prop(
    arbitrary( 'string' )
    , function( str ){
        return !!str;
  }),
  'integer x, y => div(x, y) * y + (x % y) == x' : prop(
    arbitrary( 'integer', 'integer' )
    , function( x, y ){
        return where( [ y != 0 ], function( x, y ){
          var n = Math.floor( x / y )
            , d = Math.floor( x % y );
          return n * y + d == x;
        });
  })
});

