var arbitrary = function(/* type signatures */){
  var args = Array.prototype.slice.call( arguments, 0, arguments.length );
  return new arbitrary.fn.init( args );
};

arbitrary.fn = arbitrary.prototype = (function(){
  var rList = /\[\s+([a-z]+)\s+\]/,
      selectGenerator = function( t ){
        var test = rList.exec( t );
        if ( test ){
          return Combinator.elements( GenerateRefference[ test[ 1 ] ] );
        }
        return GenerateRefference[ t ];
      };
  return {
    constructor: arbitrary,
    init: function( types ){
      this.length = types.length;
      this.types = types;
      return this;
    },
    types: [],
    length: 0,
    size: function(){
      return this.length;
    },
    property: function( property ){
      var generators = [],
          i = 0,
          ts = this.types,
          l = ts.length;
      for ( ; i < l; i++ ){
        try {
          var generator = selectGenerator( ts[ i ] );
          generators[ i ] = generator;
        } catch ( e ) {
          if( console && console.log ){
            console.log( e );
          }
        }
      }
      return forAll( generators, property );
    }
  };
})();

arbitrary.fn.init.prototype = arbitrary.fn;

