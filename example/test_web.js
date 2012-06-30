// user's tests
macchiato.stock({
  'number x, y => x + y == y + x':
    arbitrary( 'number', 'number' ).property( function( x, y ){
        return x + y === y + x;
  }),
  'string str => str can be regarded as boolean that is empty or not':
    arbitrary( 'string' ).property( function( str ){
        if ( str.length === 0 ){
          return false === !!str;
        }
        return true === !!str;
  }),
  'integer x, y (x !== y) => x - y !== y - x' :
    arbitrary( 'integer', 'integer' ).property( function( x, y ){
        return where( [ x !== y ], function(){
          return x - y !== y - x;
        });
  })
});

