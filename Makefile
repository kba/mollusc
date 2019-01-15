# Name of the software. Default: $(IMPL_NAME)
IMPL_NAME = mollusc

TRAF = traf


# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    impl  Generate data for the implementation"
	@echo "    spec  Generate the derived data in spec"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    IMPL_NAME  Name of the software. Default: $(IMPL_NAME)"

# END-EVAL


# Generate data for the implementation
impl: impl/$(IMPL_NAME)_server/src/schemas/training-schema.json \
	impl/$(IMPL_NAME)_server/ocrd-testset

impl/$(IMPL_NAME)_server/src/schemas/training-schema.json: spec/training-schema.json
	mkdir -p $(dir $@)
	cp $< $@

impl/$(IMPL_NAME)_server/ocrd-testset: impl/$(IMPL_NAME)_server/ocrd-testset.zip
	mkdir "$@"; cd "$@"; unzip ../ocrd-testset.zip

impl/$(IMPL_NAME)_server/ocrd-testset.zip:
	wget -O"$@" 'https://github.com/OCR-D/ocrd-train/raw/master/ocrd-testset.zip'

# Generate the derived data in spec
spec: spec/training-schema.json spec/gt-profile.json

spec/training-schema.json: spec/training-schema.yml
	$(TRAF) $< $@

spec/gt-profile.json: spec/gt-profile.yml
	$(TRAF) $< $@

