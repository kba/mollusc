# Name of the software. Default: $(IMPL_NAME)
IMPL_NAME = mollusc

LERNA = lerna --loglevel debug --sort 

# Tests to run
TESTS = *.test.js


# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    deps          npm install"
	@echo "    build         lerna bootstrap"
	@echo "    copy-schemas  Copy schemas from spec to the implementation"
	@echo "    repo/spec     Clone OCR-D/spec to ./repo/spec"
	@echo "    test          Run tests"
	@echo "    repo/assets   Clone OCR-D/assets to ./repo/assets"
	@echo "    assets-clean  Remove assets"
	@echo "    assets        Setup test assets"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    IMPL_NAME  Name of the software. Default: $(IMPL_NAME)"
	@echo "    TESTS      Tests to run"

# END-EVAL

# npm install
deps:
	npm install

# lerna bootstrap
build: copy-schemas
	$(LERNA) bootstrap
	# $(LERNA) bootstrap --hoist

# Copy schemas from spec to the implementation
copy-schemas: \
	repo/spec \
	$(IMPL_NAME)-backend/src/schemas/training-schema.json \
	$(IMPL_NAME)-backend/src/schemas/single-line.json

$(IMPL_NAME)-backend/src/schemas/training-schema.json: repo/spec/training-schema.json
	cp $< $@

$(IMPL_NAME)-backend/src/schemas/single-line.json: repo/spec/single-line.json
	cp $< $@

# Clone OCR-D/spec to ./repo/spec
repo/spec:
	mkdir -p $(dir $@)
	git clone https://github.com/OCR-D/spec "$@"

.PHONY: test
# Run tests
test: assets
	cd test; tap $(TESTS)
#
# Assets
#

# Clone OCR-D/assets to ./repo/assets
repo/assets:
	mkdir -p $(dir $@)
	git clone https://github.com/OCR-D/assets "$@"

# Remove assets
assets-clean:
	rm -rf test/assets

# Setup test assets
assets: repo/assets
	mkdir -p test/assets/line-ground-truth
	cp -r -t test/assets repo/assets/data/*
	cp -r -t test/assets/line-ground-truth repo/assets/gt-data/*
