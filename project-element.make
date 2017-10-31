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

SHELL := /bin/bash


# Targets common to both application and element projects
include project-common.make


# Validation -----------------------------------------------------------------------------------

.PHONY: polymerlint
polymerlint:  ## Run Polymer linter on project files
	@polymer lint --input ${NAME}.html;

.PHONY: eslint
eslint:  ## ESLint project files
	@eslint --ext .html,.js ./;


# Running -----------------------------------------------------------------------------------

.PHONY: open
open:  ## Run BrowserSync against an already-running local server
	@if lsof -i tcp:${LOCAL_PORT} > /dev/null; then \
		echo Found running Polymer server; \
	else \
		echo No Polymer server running for element demo. Use \"make serve\"; \
		exit 1; \
	fi; \
	browser-sync start \
		--config "bs-config.js" \
		--proxy "http://localhost:${LOCAL_PORT}/${QUERY_STRING}" \
		--port ${LOCAL_PORT} \
		--startPath "/components/${NAME}/demo/";

.PHONY: open-test
open-test:  ## Run BrowserSync for tests
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

.PHONY: open-app
open-app:  ## Open URL of element demo published on GitHub Pages
	@open https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/demo;

.PHONY: url-app
url-app:  ## Print URL of element demo published on GitHub Pages
	@echo https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/demo;


# Docs -----------------------------------------------------------------------------------

.PHONY: open-docs
open-docs:  ## Open URL of element documentation published on GitHub Pages
	@open https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/;

.PHONY: url-docs
url-docs:  ## Print URL of element documentation published on GitHub Pages
	@echo https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/;


# Release -----------------------------------------------------------------------------------

.PHONY: publish-github-pages
publish-github-pages:  # Internal target: Create element docs and publish on GitHub. Usually invoked as part of a release via 'release' target.
	@set -e; \
	rm -rf ./github-pages-tmp; \
	mkdir -p github-pages-tmp; \
	cd ./github-pages-tmp; \
	git gc; \
	gp.sh ${GITHUB_USER} ${NAME}; \
	git gc; \
	cd ../; \
	rm -rf ./github-pages-tmp; \
	echo Published version ${VERSION} of \"${NAME}\" element docs and demo to GitHub Pages at https://${GITHUB_USER}.github.io/${NAME}

.PHONY: bower-register
bower-register:  # Internal target: Register element in public Bower registry. Usually invoked as part of a release via 'release' target.
	@bower register --config.interactive=false ${NAME} git@github.com:${GITHUB_USER}/${NAME}.git || echo Going on...


