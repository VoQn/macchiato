
DIST_DIR = dist/

LIB = src/util.js src/interface.js src/check.js src/score.js src/seed.js src/combinator.js src/reference.js src/arbitrary.js src/checker.js src/view.js src/macchiato.js

JS = macchiato.js

MIN_JS = macchiato.min.js

all: $(MIN_JS)

$(JS): $(LIB) Makefile
	cat $(LIB) > $(DIST_DIR)$@

$(MIN_JS): $(JS)
	uglifyjs -b -nm --ascii -o $(DIST_DIR)$@ $(DIST_DIR)$(JS)
	@echo "create dist/${JS} and dist/$@"
