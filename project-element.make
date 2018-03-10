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


# Project -----------------------------------------------------------------------------------


# Validate

.PHONY: project-validate-polymerlint
project-validate-polymerlint:  ## Run Polymer linter over project source files
	@polymer lint --input ${NAME}.html;

.PHONY: project-validate-eslint
project-validate-eslint:  ## Run ESLint tool over project source files
	@eslint --ext .html,.js ./;


# Serve

.PHONY: serve
serve: project-serve-polymer  ## Shortcut for project-serve-polymer
	@echo Done;


# Browse

.PHONY: project-browse
project-browse:  ## Open locally-served element demo in browser
	@open http:localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: project-browse-demo-browsersync
project-browse-demo-browsersync:  ## Run BrowserSync, proxying against an already-running local server
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

.PHONY: project-browse-demo-browsersync-test
project-browse-demo-browsersync-test:  ## Run BrowserSync for tests
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


# Artifacts -----------------------------------------------------------------------------------


# Publish dropin

.PHONY: artifact-publish-dropin
artifact-publish-dropin: artifact-publish-dropin-versioned artifact-publish-dropin-latest  ## Release both the versioned and latest element dropin
	@echo Pubished both versioned and latest element dropin

.PHONY: artifact-publish-dropin-versioned
artifact-publish-dropin-versioned:  ## Release versioned element dropin
	@aws s3 sync ./build/dropin s3://connect.filethis.com/${NAME}/${VERSION}/dropin/;

.PHONY: artifact-publish-dropin-latest
artifact-publish-dropin-latest:  ## Release latest element dropin
	@aws s3 sync ./build/dropin s3://connect.filethis.com/${NAME}/latest/dropin/;

.PHONY: artifact-invalidate-dropin-latest
artifact-invalidate-dropin-latest:  ## Invalidate CDN distribution of latest element dropin
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/latest/dropin/*"; fi

.PHONY: invalidate
invalidate: artifact-invalidate-dropin-latest  ## Shortcut for artifact-invalidate-dropin-latest
	@echo Invalidated;


# Publish demo

.PHONY: artifact-publish-demo
artifact-publish-demo: artifact-publish-demo-versioned artifact-publish-demo-latest  ## Release both the versioned and latest element demo
	@echo Pubished both versioned and latest element demo

.PHONY: artifact-publish-demo-versioned
artifact-publish-demo-versioned:  ## Release versioned element demo
	@aws s3 sync ./build/demo s3://connect.filethis.com/${NAME}/${VERSION}/demo/;

.PHONY: artifact-publish-demo-latest
artifact-publish-demo-latest:  ## Release latest element demo
	@aws s3 sync ./build/demo s3://connect.filethis.com/${NAME}/latest/demo/;

.PHONY: artifact-invalidate-demo-latest
artifact-invalidate-demo-latest:  ## Invalidate CDN distribution of latest element demo
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/latest/demo/*"; fi

.PHONY: artifact-publish-demo-github-pages
artifact-publish-demo-github-pages:  # Internal target: Create element docs and publish on GitHub. Usually invoked as part of a release via 'release' target.
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

.PHONY: publish
publish: artifact-publish-dropin  ## Shortcut for artifact-publish-dropin
	@echo Published;


# Publications -----------------------------------------------------------------------------------


# Browse published demo

.PHONY: publication-browse-demo-versioned
publication-browse-demo-versioned:  ## Open the published, versioned demo in browser
	@open https://connect.filethis.com/${NAME}/${VERSION}/demo/index.html;

.PHONY: publication-browse-demo-latest
publication-browse-demo-latest:  ## Open the published, latest demo in browser
	@open https://connect.filethis.com/${NAME}/latest/demo/index.html;

.PHONY: publication-browse-demo-github-pages
publication-browse-demo-github-pages:  ## Open URL of demo published on GitHub Pages
	@open https://${GITHUB_USER}.github.io/${NAME}/;


# Print URL of published demo

.PHONY: publication-url-demo-versioned
publication-url-demo-versioned:  ## Print the published, versioned demo url
	@echo https://connect.filethis.com/${NAME}/${VERSION}/demo/index.html;

.PHONY: publication-url-demo-latest
publication-url-demo-latest:  ## Print the published, latest demo url
	@echo https://connect.filethis.com/${NAME}/latest/demo/index.html;

.PHONY: publication-url-demo-github-pages
publication-url-demo-github-pages:  ## Print URL of demo published on GitHub Pages
	@echo https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/demo;


# Browse published docs

.PHONY: publication-browse-docs-github-pages
publication-browse-docs-github-pages:  ## Open URL of application documentation published on GitHub Pages
	@open https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/;


# Print URL of published docs

.PHONY: publication-url-docs-github-pages
publication-url-docs-github-pages:  ## Print URL of docs published on GitHub Pages
	@echo https://${GITHUB_USER}.github.io/${NAME}/components/${NAME}/;


# Bower -----------------------------------------------------------------------------------

.PHONY: bower-register
bower-register:  # Internal target: Register element in public Bower registry. Usually invoked as part of a release via 'release' target.
	@bower register --config.interactive=false ${NAME} git@github.com:${GITHUB_USER}/${NAME}.git || echo Going on...


