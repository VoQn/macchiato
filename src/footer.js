
if (typeof exports === 'undefined') {
  // instead of module exporter
  Macchiato = {};
  Macchiato.macchaito = macchiato;
  Macchiato.arbitrary = arbitrary;
  Macchiato.where = where;
} else {
  exports.macchaito = macchiato;
  exports.arbitrary = arbitrary;
  exports.where = where;
}

// EOF
