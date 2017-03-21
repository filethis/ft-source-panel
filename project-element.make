# Targets common to both application and element projects
include project-common.make


# Validation -----------------------------------------------------------------------------------

.PHONY: lint
lint:  ## Lint project files
	@polymer lint --input ${NAME}.html;


# Running -----------------------------------------------------------------------------------

.PHONY: run-browser-sync
run-browser-sync:  ## Run BrowserSync against local files. Element demos require a running Polymer server. See: https://www.browsersync.io/
	@if lsof -i tcp:${LOCAL_PORT} > /dev/null; then \
		echo Polymer server is running; \
	else \
		echo No Polymer server running for element demo. Use \"make serve-polymer\"; \
		exit 1; \
	fi; \
	browser-sync start \
		--proxy "http://localhost:${LOCAL_PORT}" \
		--port ${LOCAL_PORT} \
		--startPath "/components/${NAME}/demo/" \
		--files "*.html, *.css, demo/*.html, demo/*.css, demo/*.json, test/*.html";


# Viewing -----------------------------------------------------------------------------------

.PHONY: open-url
open-url:  ## Open URL of local element demo
	@open http://localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: print-url
print-url:  ## Print URL of local element demo
	@echo http://localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: open-url-published
open-url-published:  ## Open URL of published element demo
	@open https://filethis.github.io/${NAME}/components/${NAME}/demo;

.PHONY: print-url-published
print-url-published:  ## Print URL of published element demo
	@echo https://filethis.github.io/${NAME}/components/${NAME}/demo;

.PHONY: open-url-doc-page
open-url-doc-page:  ## Open URL of local documentation page
	@open http://localhost:${LOCAL_PORT}/components/${NAME}/;

.PHONY: print-url-doc-page
print-url-doc-page:  ## Print URL of local documentation page
	@echo http://localhost:${LOCAL_PORT}/components/${NAME}/;

.PHONY: open-url-doc-page-published
open-url-doc-page-published:  ## Open URL of published project documentation page
	@open https://filethis.github.io/${NAME}/components/${NAME}/;

.PHONY: print-url-doc-page-published
print-url-doc-page-published:  ## Print URL of published project documentation page
	@echo https://filethis.github.io/${NAME}/components/${NAME}/;


# Publishing -----------------------------------------------------------------------------------

publish-doc-page:
	@set -e; \
	rm -rf ./docs-github-tmp; \
	mkdir -p docs-github-tmp; \
	cd ./docs-github-tmp; \
	gp.sh filethis ${NAME}; \
	cd ../; \
	rm -rf ./docs-github-tmp;

.PHONY: register
register:  ## Register element in public Bower registry
	@bower register ${NAME} git@github.com:filethis/${NAME}.git;

.PHONY: publish
publish: test-chrome tag-release git-push-tags publish-doc-page open-url-doc-page-published  ## Publish project. Bump value of "VERSION" variable at top of project Makefile.
	@echo Published version ${VERSION} of ${NAME};
