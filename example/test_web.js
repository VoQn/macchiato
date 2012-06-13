// user's tests
macchiato.stock({
  'number x, y => x + y == y + x' :
    arbitrary( 'number', 'number' ).property( function( x, y ){
        return x + y == y + x;
  }),
  'string str => str == true' :
    arbitrary( 'string' ).property( function( str ){
        return !!str;
  }),
  'integer x, y => div(x, y) * y + (x % y) == x' :
    arbitrary( 'integer', 'integer' ).property( function( x, y ){
        return where( [ y != 0 ], function( x, y ){
          var n = Math.floor( x / y ), d = Math.floor( x % y );
          return n * y + d == x;
        });
  })
});

