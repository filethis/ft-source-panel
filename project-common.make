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


#------------------------------------------------------------------------------
# Project
#------------------------------------------------------------------------------


# Initialize

.PHONY: project-init-github
project-init-github:  ## Initialize GitHub project
	@repo_url="https://github.com/${GITHUB_USER}/${NAME}"; \
	if curl -s --head  --request GET $$repo_url | grep "200 OK" > /dev/null; then \
		echo GitHub project already exists; \
	else \
		echo Cannot reach GitHub repo: $$repo_url Do you need to create it?; \
		exit 1; \
	fi; \
	git init; \
	git add .; \
	git commit -m "First commit"; \
	git remote add origin $$repo_url; \
	git push -u origin master


#------------------------------------------------------------------------------
# Source
#------------------------------------------------------------------------------

# Serve

.PHONY: source-serve-polymer
source-serve-polymer:  ## Serve application or element demo locally using the Polymer server
	@echo http:localhost:${LOCAL_PORT}; \
	polymer serve --open --port ${LOCAL_PORT}

.PHONY: source-serve
source-serve: source-serve-polymer  ## Shortcut for source-serve-polymer
	@echo source-serve;

# Test

.PHONY: source-test-all
source-test-all:  ## Run tests on all browsers
	@polymer test

.PHONY: source-test-chrome
source-test-chrome:  ## Run tests on Chrome only
	@polymer test -l chrome

.PHONY: source-test-firefox
source-test-firefox:  ## Run tests on Firefox only
	@polymer test -l firefox

.PHONY: source-test-safari
source-test-safari:  ## Run tests on Safari only
	@polymer test -l safari

.PHONY: source-find-version-everywhere
source-find-version-everywhere:  ## Find and print versions of this project in use by all peer projects
	@echo Current: ${VERSION}; \
	find ../.. -name bower.json -print | xargs grep "${GITHUB_USER}/${NAME}#^[0-9]\+.[0-9]\+.[0-9]\+" || echo Not used;

# Other

.PHONY: source-set-version-everywhere
source-set-version-everywhere:
	python ../../bin/set-version-everywhere.py ${NAME} ${VERSION} ../..; \
	echo Set version in all projects that depend on this one

.PHONY: source-git-tag-version-and-push
source-git-tag-version-and-push:  ## Tag with current version and push tags to remote for the git project. Usually invoked as part of a release via 'release' target.
	@if [[ $$(git tag --list v${VERSION}) ]]; then \
		echo Tag v${VERSION} already applied; \
	else \
		git tag -a v${VERSION} -m '${VERSION}'; \
	fi; \
	git push --tags;

.PHONY: source-bump-version
source-bump-version:  ## Increment the patch version number.
	@NEW_VERSION=`../../bin/increment_version.sh -p ${VERSION}`; \
	COMMAND=s/VERSION=[0-9][0-9]*.[0-9][0-9]*.[0-9][0-9]*/VERSION=$$NEW_VERSION/g; \
	sed -i .bak $$COMMAND ./Makefile && rm ./Makefile.bak; \
	echo "Bumped ${VERSION} ---> $$NEW_VERSION"; \
	python ../../bin/set-version-everywhere.py  ${NAME} $$NEW_VERSION ../..; \
	echo Set version in all projects that depend on this one

.PHONY: source-release
source-release: source-set-version-everywhere git-add-fast git-commit-fast git-push source-git-tag-version-and-push  ## Release source version of project.
	@echo Released version ${VERSION} of \"${NAME}\" project
#source-release: source-set-version-everywhere git-add-fast git-commit-fast git-push source-git-tag-version-and-push bower-register publish-github-pages  ## Release source version of project.
#	@echo Released version ${VERSION} of \"${NAME}\" project


#------------------------------------------------------------------------------
# Distribution
#------------------------------------------------------------------------------

# Clean

.PHONY: dist-clean
dist-clean:  ## Clean all distribution builds
	@rm -rf ./build;

# Build

.PHONY: dist-build
dist-build:  ## Build all distributions
	@NODE_OPTIONS="--max-old-space-size=8192" polymer build;

# Merge

.PHONY: dist-merge
dist-merge:  ## Merge distribution into parent
	@python ../../bin/merge.py --project-name=${NAME} --src-dir-path=./dist --dst-dir-path=../../dist/

# Deploy

.PHONY: dist-deploy-dev
dist-deploy-dev:  ## Deploy versioned dev distribution to CDN
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync ./build/dev s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/dev/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/dev/index.html;

.PHONY: dist-deploy-prod
dist-deploy-prod:  ## Deploy versioned prod distribution to CDN
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync ./build/prod s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/index.html;

.PHONY: dist-deploy-debug
dist-deploy-debug:  ## Deploy versioned debug distribution to CDN
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync ./build/debug s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/debug/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/debug/index.html;

.PHONY: dist-deploy
dist-deploy: dist-deploy-prod dist-deploy-debug dist-deploy-dev  ## Shortcut for: dist-deploy-prod dist-deploy-debug dist-deploy-dev
	@echo dist-deploy;

# Invalidate

.PHONY: dist-invalidate
dist-invalidate-dev:  ## Invalidate all versioned distributions on CDN
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; else aws-vault exec ${AWS_VAULT_PROFILE} -- aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/${VERSION}/*"; fi


#------------------------------------------------------------------------------
# Git
#------------------------------------------------------------------------------

.PHONY: git-add
git-add:  ## Add all git changes, interactively
	git add -A --interactive

.PHONY: git-add-dry-run
git-add-dry-run:  ## Do a "dry run" of adding all changes so they will be printed out
	git add -A -n;

.PHONY: git-add-fast
git-add-fast:  ## Add all git changes non-interactively
	git add -A

.PHONY: git-commit
git-commit:  ## Commit all git changes, prompting for a checkin message
	git commit || echo nothing to commit

.PHONY: git-commit-fast
git-commit-fast:  ## Commit all git changes with a worthless message
	git commit -m "WIP" || echo nothing to commit

.PHONY: git-push
git-push:  ## Push from Git repository
	git push

.PHONY: git-pull
git-pull:  ## Pull from Git repository
	git pull

.PHONY: git-status
git-status:  ## Print git status
	@git status -s

.PHONY: git-checkout-master
git-checkout-master:  ## Check out master branch
	@git checkout master

.PHONY: git-checkout-branch
git-checkout-branch:  ## Check out master branch
	@git checkout topic

.PHONY: git-create-branch
git-create-branch:  ## Create and check out branch
	@git checkout -b topic


#------------------------------------------------------------------------------
# GitHub
#------------------------------------------------------------------------------

.PHONY: github-browse-repo
github-browse-repo:  ## Open URL of project GitHub repository page
	@open https://github.com/${GITHUB_USER}/${NAME}

.PHONY: github-url-repo
github-url-repo:  ## Print URL of project GitHub repository page
	@echo https://github.com/${GITHUB_USER}/${NAME}


#------------------------------------------------------------------------------
# NPM
#------------------------------------------------------------------------------

.PHONY: npm-install-packages
npm-install-packages:  ## Install all NPM packages specified in package.json file, using symlinks for FileThis projects.
	@npm install


#------------------------------------------------------------------------------
# Bower
#------------------------------------------------------------------------------

.PHONY: bower-info
bower-info:  ## Print information about published Bower package
	@echo Current: ${VERSION}; \
	bower info ${NAME};

.PHONY: bower-install-packages
bower-install-packages:  ## Install all Bower packages specified in bower.json file, using symlinks for FileThis projects.
	@mkdir -p ./bower_components; \
	python ../../bin/bower-install.py True ${GITHUB_USER_ABBREV}

.PHONY: bower-install-packages-prod
bower-install-packages-prod:  ## Install all Bower packages specified in bower.json file
	@mkdir -p ./bower_components; \
	python ../../bin/bower-install.py False ${GITHUB_USER_ABBREV}

.PHONY: bower-clean-packages
bower-clean-packages:  ## Clean all installed bower packages.
	@cd ./bower_components; \
	find . -mindepth 1 -maxdepth 1 -exec rm -rf {} +;

.PHONY: bower-reinstall-packages
bower-reinstall-packages: bower-clean-packages bower-install-packages  ## Clean and reinstall all bower packages using symlinks for FileThis projects.

.PHONY: bower-reinstall-packages-prod
bower-reinstall-packages-prod: bower-clean-packages bower-install-packages-prod  ## Clean and reinstall all bower packages.


#------------------------------------------------------------------------------
# Modularizer (For migration from Polymer version 2 to version 3
#------------------------------------------------------------------------------

.PHONY: modularize
modularize:  # Convert from from Polymer version 2 to version 3
	@modulizer --import-style name --out .


#------------------------------------------------------------------------------
# Shortcuts
#------------------------------------------------------------------------------

.PHONY: serve
serve: source-serve  ## Shortcut for source-serve
	@echo serve;

.PHONY: browse
browse: source-browse  ## Shortcut for source-browse
	@echo browse;

.PHONY: clean
clean: dist-clean  ## Shortcut for dist-clean
	@echo clean;

.PHONY: build
build: dist-build  ## Shortcut for dist-build
	@echo build;

.PHONY: merge
merge: dist-merge  ## Shortcut for dist-merge
	@echo merge;

.PHONY: deploy
deploy: dist-deploy  ## Shortcut for dist-deploy
	@echo deploy;

.PHONY: invalidate
invalidate: dist-invalidate  ## Shortcut for dist-invalidate
	@echo invalidate;



#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help