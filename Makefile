export

# How many projects to build simultaneously. Default: $(CONCURRENCY)
CONCURRENCY = 2

# Tag of the docker image to build
DOCKER_TAG = ocrd/mollusc

# lerna command. Default: $(LERNA)
LERNA = npx lerna --loglevel debug --sort $(LERNA_ARGS) --concurrency $(CONCURRENCY)

# args to $(LERNA) build
LERNA_BOOTSTRAP_ARGS = 

# Tests to run
TESTS = *.test.js


# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    deps          npm install"
	@echo "    build         lerna bootstrap"
	@echo "    lerna         Run lerna"
	@echo "    copy-schemas  Copy schemas from spec to the implementation"
	@echo "    repo/spec     Clone OCR-D/spec to ./repo/spec"
	@echo "    test          Run tests"
	@echo "    repo/assets   Clone OCR-D/assets to ./repo/assets"
	@echo "    assets-clean  Remove assets"
	@echo "    assets        Setup test assets"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    CONCURRENCY  How many projects to build simultaneously. Default: $(CONCURRENCY)"
	@echo "    DOCKER_TAG   Tag of the docker image to build"
	@echo "    LERNA        lerna command. Default: $(LERNA)"
	@echo "    TESTS        Tests to run"

# END-EVAL

# npm install
deps:
	npm install

# lerna bootstrap
build: copy-schemas lerna

# Run lerna
lerna:
	$(LERNA) bootstrap $(LERNA_BOOTSTRAP_ARGS)
	# $(LERNA) bootstrap --hoist

# Copy schemas from spec to the implementation
copy-schemas: \
	repo/spec \
	mollusc-backend/src/schemas/training-schema.json \
	mollusc-backend/src/schemas/single-line.json

mollusc-backend/src/schemas/training-schema.json: repo/spec/training-schema.json
	cp $< $@

mollusc-backend/src/schemas/single-line.json: repo/spec/single-line.json
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

# Build docker image $(DOCKER_TAG)
docker:
	docker build \
		--build-arg https_proxy="$$https_proxy" \
		--build-arg HTTPS_PROXY="$$HTTPS_PROXY" \
		--build-arg http_proxy="$$http_proxy" \
		--build-arg HTTP_PROXY="$$HTTP_PROXY" \
		-t $(DOCKER_TAG) .
