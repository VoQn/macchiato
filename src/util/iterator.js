// List iteration utilities

/**
 * @description instead of Array.isArray
 * @param {!Array|!Object} object
 * @return {boolean} parameter is kind of list or not
 */
var isList;
if ( !!Array.isArray ){
  isList = Array.isArray;
} else {
  isList = function( object ){
    return Object.prototype.toString.call( object ) === '[object Array]';
  };
}

/**
 * @param {function(*, number=)} callback
 * @param {!Array} elements
 * @return {Array} new array or object
 */
var map = function( callback, elements ){
  var new_array_ = [], index_ = 0, length_ = elements.length;

  for ( ; index_ < length_; index_++ ){
    new_array_[ index_ ] = callback( elements[ index_ ], index_ );
  }
  return new_array_;
};

var modify = function( object ){
  var name_, new_object_ = clone( object );
  for ( name_ in object ){
    if ( object.hasOwnProperty( name_ ) ){
      new_object[ name_ ] = callback( object[ name_ ], name_ );
    }
  }
  return new_object_;
};

/**
 * @param {function(Object, (string|number)=)} callback
 * @param {!Array|!Object} elements
 */
var each = function( callback, elements ){
  var index_ = 0, length_ = elements.length;

  for ( ; index_ < length_; index_++ ){
    callback( elements[ index_ ], index_ );
  }
};

var eachKeys = function( callback, object ){
  var name_;
  for ( name_ in object ) {
    if ( object.hasOwnProperty( name_ ) ){
      callback( object[ name_ ], name_ );
    }
  }
};

/**
 * @param {function(Object, number=): boolean} callback
 * @param {!Array} elements
 * @return {Array} new array list
 */
var filter = function( callback, elements ){
  var result_ = [],
      index_ = 0,
      new_index_ = 0,
      length_ = elements.length,
      element_;

  for ( ; index_ < length_; index_++ ){
    element_ = elements[ index_ ];
    if ( callback( element_, index_ ) ){
      result_[ new_index_ ] = element_;
      new_index_++;
    }
  }

  return result_;
};

/**
 * @param {function(Object, number=):boolean} test
 * @param {!Array} elements
 * @return {boolean}
 */
var hasAny = function( test, elements ){
  var index_ = 0, length_ = elements.length;

  for ( ; index_ < length_; index_++ ){
    if ( test( elements[ index_ ], index_ ) ){
      return true;
    }
  }
  return false;
};

/**
 * @param {function(Object, number=):boolean} test
 * @param {!Array} elements
 * @return {boolean}
 */
var hasAll = function( test, elements ){
  var index_ = 0,
      length_ = elements.length;

  for ( ; index_ < length; index_++ ){
    if ( !test( elements[ index_ ], index_ ) ) {
      return false;
    }
  }
  return true;
};

/**
 * @param {*} init
 * @param {function(*, *):*} collector
 * @param {!Array} elements
 * @return {*}
 */
var foldLeft = function( init, collector, elements ){
  var result_ = init, index_ = 0, length_ = elements.length;

  for ( ; index_ < length_; index_++ ){
    result_ = collector( elements[ index_ ], result_ );
  }
  return result_;
};

/**
 * @param {*} init
 * @param {function(*, *):*} collector
 * @param {!Array} elements
 * @return {*}
 */
var foldRight = function( init, collector, elements ){
  var result_ = init, index_ = elements.length - 1;

  for ( ; index_ > -1; index_-- ){
    result_ = collector( elements[ index_ ], result_ );
  }
  return result_;
};

/**
 * @description sum of number array
 * <pre><code>arbitrary( '[number]' ).property( function( numbers ){
 *   var add = function( a, b ){ return a + b; };
 *   return sumOf( numbers ) === foldLeft( 0, add, numbers );
 * }</code></pre>
 * @param {!Array.<number>} numbers
 * @return {number}
 */
var sumOf = function( numbers ){
  var result_ = 0, index_ = 0, length_ = numbers.length;

  for ( ; index_ < length_; index_++ ){
    result_ += numbers[ index_ ];
  }
  return result_;
};

