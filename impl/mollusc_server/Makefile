# Tests to run
TESTS = test/*.test.js

# BEGIN-EVAL makefile-parser --make-help Makefile

help:
	@echo ""
	@echo "  Targets"
	@echo ""
	@echo "    bootstrap  Initial setup"
	@echo "    test       Run tests"
	@echo ""
	@echo "  Variables"
	@echo ""
	@echo "    TESTS  Tests to run"

# END-EVAL


# Initial setup
bootstrap:
	npm install

.PHONY: test
# Run tests
test:
	tap $(TESTS)
