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


# Docs -----------------------------------------------------------------------------------

.PHONY: open-url-docs-local
open-url-docs-local:  ## Open URL of local element documentation
	@open http://localhost:${LOCAL_PORT}/components/${NAME}/;

.PHONY: print-url-docs-local
print-url-docs-local:  ## Print URL of local element documentation
	@echo http://localhost:${LOCAL_PORT}/components/${NAME}/;

.PHONY: open-url-docs-github-pages
open-url-docs-github-pages:  ## Open URL of element documentation published on GitHub Pages
	@open https://filethis.github.io/${NAME}/components/${NAME}/;

.PHONY: print-url-docs-github-pages
print-url-docs-github-pages:  ## Print URL of element documentation published on GitHub Pages
	@echo https://filethis.github.io/${NAME}/components/${NAME}/;


# Demo -----------------------------------------------------------------------------------

.PHONY: open-url-demo-local
open-url-demo-local:  ## Open URL of local element demo
	@open http://localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: print-url-demo-local
print-url-demo-local:  ## Print URL of local element demo
	@echo http://localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: open-url-demo-github-pages
open-url-demo-github-pages:  ## Open URL of element demo published on GitHub Pages
	@open https://filethis.github.io/${NAME}/components/${NAME}/demo;

.PHONY: print-url-demo-github-pages
print-url-demo-github-pages:  ## Print URL of element demo published on GitHub Pages
	@echo https://filethis.github.io/${NAME}/components/${NAME}/demo;


# Publish -----------------------------------------------------------------------------------

.PHONY: publish-github-pages
publish-github-pages: release-github-repo  ## Publish current release of element docs and demo to GitHub Pages.
	@set -e; \
	rm -rf ./github-pages-tmp; \
	mkdir -p github-pages-tmp; \
	cd ./github-pages-tmp; \
	gp.sh filethis ${NAME}; \
	cd ../; \
	rm -rf ./github-pages-tmp; \
	echo Published version ${VERSION} of \"${NAME}\" element docs and demo to GitHub Pages at https://filethis.github.io/${NAME}

.PHONY: bower-register-public
bower-register-public:  ## Register element in public Bower registry
	@bower register ${NAME} git@github.com:filethis/${NAME}.git;

