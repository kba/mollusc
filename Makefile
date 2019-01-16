# Name of the software. Default: $(IMPL_NAME)
IMPL_NAME = mollusc

TRAF = traf

# Tests to run
TESTS = *.test.js


# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    build-backend  Generate data for the implementation"
	@echo "    spec           Generate the derived data in spec"
	@echo "    test           Run tests"
	@echo "    testdata       Download testdata"
	@echo "    deps           npm install"
	@echo "    build          lerna bootstrap"
	@echo "    build          lerna bootstrap"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    IMPL_NAME  Name of the software. Default: $(IMPL_NAME)"
	@echo "    TESTS      Tests to run"

# END-EVAL


# Generate the derived data in spec
spec: spec/training-schema.json spec/gt-profile.json

spec/training-schema.json: spec/training-schema.yml
	$(TRAF) $< $@

spec/gt-profile.json: spec/gt-profile.yml
	$(TRAF) $< $@

.PHONY: test
# Run tests
test: testdata
	cd test; tap $(TESTS)

# Download testdata
testdata: test/ocrd-testset

test/ocrd-testset: test/ocrd-testset.zip
	mkdir "$@"; cd "$@"; unzip ../test/ocrd-testset.zip

test/ocrd-testset.zip:
	wget -O"$@" 'https://github.com/OCR-D/ocrd-train/raw/master/ocrd-testset.zip'

# npm install
deps:
	npm install

# lerna bootstrap
build: build-backend
	lerna bootstrap --hoist

# Generate data for the implementation
build-backend: $(IMPL_NAME)-backend/src/schemas/training-schema.json

$(IMPL_NAME)-backend/src/schemas/training-schema.json: spec/training-schema.json
	cp $< $@
