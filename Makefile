
DIST_DIR = dist/

LIB = src/util.js src/check.js src/score.js src/seed.js src/combinator.js src/gen.js src/tester.js src/macchiato.js

JS = macchiato.js

MIN_JS = macchiato.min.js

all: $(MIN_JS)

$(JS): $(LIB) Makefile
	@cat $(LIB) > $(DIST_DIR)$@

$(MIN_JS): $(JS)
	@uglifyjs -o $(DIST_DIR)$@ $(DIST_DIR)$(JS)
