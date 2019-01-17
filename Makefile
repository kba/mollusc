# Name of the software. Default: $(IMPL_NAME)
IMPL_NAME = mollusc

TRAF = traf

LERNA = lerna --loglevel debug --sort 

# Tests to run
TESTS = *.test.js


# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    deps           npm install"
	@echo "    build          lerna bootstrap"
	@echo "    build-backend  Generate data for the implementation"
	@echo "    spec           Generate the derived data in spec"
	@echo "    test           Run tests"
	@echo "    repo/assets    Clone OCR-D/assets to ./repo/assets"
	@echo "    assets-clean   Remove assets"
	@echo "    assets         Setup test assets"
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
build: build-backend
	$(LERNA) bootstrap
	# $(LERNA) bootstrap --hoist

# Generate data for the implementation
build-backend: $(IMPL_NAME)-backend/src/schemas/training-schema.json

$(IMPL_NAME)-backend/src/schemas/training-schema.json: spec/training-schema.json
	cp $< $@

# Generate the derived data in spec
spec: spec/training-schema.json spec/gt-profile.json

spec/training-schema.json: spec/training-schema.yml
	$(TRAF) $< $@

spec/gt-profile.json: spec/gt-profile.yml
	$(TRAF) $< $@

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
	mkdir -p test/assets
	cp -r -t test/assets repo/assets/gt-data/*
