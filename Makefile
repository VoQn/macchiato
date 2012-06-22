
DIST_DIR = dist/

LIB = src/util/functional.js src/util/object.js src/util/iterator.js src/util.js src/interface.js src/check.js src/score.js src/seed.js src/combinator.js src/reference.js src/arbitrary.js src/checker.js src/view.js src/macchiato.js

JS = macchiato.js

MIN_JS = macchiato.min.js

MINIFIER = minify.coffee

all: $(MIN_JS)

$(JS): $(LIB) Makefile
	cat $(LIB) > $(DIST_DIR)$@

$(MIN_JS): $(JS)
	coffee $(MINIFIER)
	@echo "create dist/${JS} and dist/$@"
