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

# END-EVAL


# Generate data for the implementation
impl: impl/$(IMPL_NAME)/model/training-schema.json

impl/$(IMPL_NAME)/model/training-schema.json: spec/training-schema.json
	mkdir -p $(dir $@)
	cp $< $@

# Generate the derived data in spec
spec: spec/training-schema.json spec/gt-profile.json

spec/training-schema.json: spec/training-schema.yml
	$(TRAF) $< $@

spec/gt-profile.json: spec/gt-profile.yml
	$(TRAF) $< $@

