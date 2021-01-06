#
# Copyright 2018 FileThis, Inc.
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


#------------------------------------------------------------------------------
# Source
#------------------------------------------------------------------------------

# Lint

.PHONY: source-lint-polymerlint
source-lint-polymerlint:  ## Run Polymer linter over project source files
	@echo polymer lint; \
	polymer lint --input ${NAME}.html || true;

.PHONY: source-lint-eslint
source-lint-eslint:  ## Run ESLint tool over project source files
	@echo eslint; \
    eslint --ext .html,.js ./ || true;

.PHONY: source-lint
source-lint: source-lint-polymerlint source-lint-eslint ## Shortcut for source-lint-polymerlint and source-lint-eslint
	@echo source-lint;

# Serve

# TODO: Add for demo app so is similar to what project-application.make provides?

# Browse

.PHONY: source-browse
source-browse:  ## Open locally-served element demo in browser
	@open http:localhost:${LOCAL_PORT}/components/${NAME}/demo/;

.PHONY: source-browse-demo-browsersync
source-browse-demo-browsersync:  ## Run BrowserSync, proxying against an already-running local server
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

.PHONY: source-browse-demo-browsersync-test
source-browse-demo-browsersync-test:  ## Run BrowserSync for tests
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


#------------------------------------------------------------------------------
# Distribution
#------------------------------------------------------------------------------

# Serve

.PHONY: dist-serve-dev
dist-serve-dev:  ## Serve dev demo in local build directory using "polymer serve". Useful to check before releasing.
	@echo http:localhost:${LOCAL_PORT}; \
	echo Not yet implemented. Serve the demo app for element;

.PHONY: dist-serve-prod
dist-serve-prod:  ## Serve production demo in local build directory using "polymer serve". Useful to check before releasing.
	@echo http:localhost:${LOCAL_PORT}; \
	echo Not yet implemented. Serve the demo app for element;

.PHONY: dist-serve-debug
dist-serve-debug:  ## Serve debug demo in local build directory using "polymer serve". Useful to check before releasing.
	@echo http:localhost:${LOCAL_PORT}; \
	echo Not yet implemented. Serve the demo app for element;

.PHONY: dist-serve-custom
dist-serve-custom:  ## Serve demo in local build directory using Python 2.7. Useful to check before releasing.
	@echo http:localhost:${LOCAL_PORT}; \
	echo Not yet implemented. Serve the demo app for element;

.PHONY: dist-serve
dist-serve: dist-serve-dev  ## Shortcut for dist-serve-dev
	@echo dist-serve;


#------------------------------------------------------------------------------
# Publications
#------------------------------------------------------------------------------

# Browse

.PHONY: publication-browse-dev
publication-browse-dev:  ## Open the published dev element demo
	@open https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/dev/demo/index.html;

.PHONY: publication-browse-prod
publication-browse-prod:  ## Open the published prod element demo
	@open https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/demo/index.html;

.PHONY: publication-browse-debug
publication-browse-debug:  ## Open the published debug element demo
	@open https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/debugdemo//index.html;

# URL

.PHONY: publication-url-dev
publication-url-dev:  ## Print URL of the published dev element demo
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/dev/demo/index.html;

.PHONY: publication-url-prod
publication-url-prod:  ## Print URL of the published prod element demo
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/demo/index.html;

.PHONY: publication-url-debug
publication-url-debug:  ## Print URL of the published debug element demo
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/debug/demo/index.html;


#------------------------------------------------------------------------------
# Other
#------------------------------------------------------------------------------

.PHONY: update-polymerjson
update-polymerjson:  ## Internal. Used when polymer.json templates have changed.
	@pushd ../../ > /dev/null; \
	NAME=${NAME} ./bin/moustache ./project-templates/element/polymer.json ./elements/${NAME}/polymer.json; \
	popd > /dev/null; \
	echo Updated polymer.json;


#------------------------------------------------------------------------------
# Distribution of polyfills needed by FileThis applications
#------------------------------------------------------------------------------

.PHONY: polyfills-deploy
polyfills-deploy:  # Deploy copies of polyfill libraries to CDN
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync \
		./node_modules/@webcomponents/webcomponentsjs/ \
		s3://${PUBLICATION_DOMAIN}/webcomponents/webcomponentsjs/2.5.0/;
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync \
		./node_modules/@babel/helpers/ \
		s3://${PUBLICATION_DOMAIN}/babel/helpers/7.12.5/;
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync \
		./node_modules/babel-helpers/ \
		s3://${PUBLICATION_DOMAIN}/babel/helpers/6.24.1/;
