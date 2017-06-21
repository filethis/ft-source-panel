#
# Copyright 2017 FileThis, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


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
		echo Found running Polymer server; \
	else \
		echo No Polymer server running for element demo. Use \"make serve\"; \
		exit 1; \
	fi; \
	browser-sync start \
		--config "bs-config.js" \
		--proxy "http://localhost:${LOCAL_PORT}" \
		--port ${LOCAL_PORT} \
		--startPath "/components/${NAME}/demo/";

.PHONY: run-browser-sync-test
run-browser-sync-test:  ## Run BrowserSync for tests
	@if lsof -i tcp:${LOCAL_PORT} > /dev/null; then \
		echo Found running Polymer server; \
	else \
		echo No Polymer server running for element demo. Use \"make serve\"; \
		exit 1; \
	fi; \
	browser-sync start \
		--config "bs-config.js" \
		--proxy "http://localhost:${LOCAL_PORT}" \
		--port ${LOCAL_PORT} \
		--startPath "/components/${NAME}/test/" \
		--index "${NAME}_test.html";


# Demo -----------------------------------------------------------------------------------

.PHONY: open-url-local
open-url-local:  ## Open URL of local element demo
	@open http://localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: print-url-local
print-url-local:  ## Print URL of local element demo
	@echo http://localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: open-url-github-pages
open-url-github-pages:  ## Open URL of element demo published on GitHub Pages
	@open https://filethis.github.io/${NAME}/components/${NAME}/demo;

.PHONY: print-url-github-pages
print-url-github-pages:  ## Print URL of element demo published on GitHub Pages
	@echo https://filethis.github.io/${NAME}/components/${NAME}/demo;


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


# Release -----------------------------------------------------------------------------------

.PHONY: release-github-pages
release-github-pages:  # Internal target: Create element docs and publish on GitHub. Usually invoked as part of a release via 'release' target.
	@set -e; \
	rm -rf ./github-pages-tmp; \
	mkdir -p github-pages-tmp; \
	cd ./github-pages-tmp; \
	git gc; \
	gp.sh filethis ${NAME}; \
	git gc; \
	cd ../; \
	rm -rf ./github-pages-tmp; \
	echo Published version ${VERSION} of \"${NAME}\" element docs and demo to GitHub Pages at https://filethis.github.io/${NAME}

.PHONY: bower-register
bower-register:  # Internal target: Register element in public Bower registry. Usually invoked as part of a release via 'release' target.
	@bower register ${NAME} git@github.com:filethis/${NAME}.git;


