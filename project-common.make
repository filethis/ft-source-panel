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


# Project Initialization -----------------------------------------------------------------------------------

.PHONY: github-init
github-init:  ## Initialize GitHub project
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

.PHONY: install-bower-packages
install-bower-packages:  ## Install all Bower packages specified in bower.json file
	@bower install --save

.PHONY: clean-bower-packages
clean-bower-packages:  ## Clean all installed bower packages. Leaves "bower link" symlink directories alone.
	@cd ./bower_components; \
	find . -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} +;

.PHONY: reinstall-bower-packages
reinstall-bower-packages: clean-bower-packages install-bower-packages  ## Clean and reinstall all bower packages. Leaves "bower link" symlink directories alone.


# Testing -----------------------------------------------------------------------------------

.PHONY: test-all
test-all:  ## Run tests on all browsers
	@polymer test

.PHONY: test-chrome
test-chrome:  ## Run tests on Chrome only
	@polymer test -l chrome

.PHONY: test-firefox
test-firefox:  ## Run tests on Firefox only
	@polymer test -l firefox

.PHONY: test-safari
test-safari:  ## Run tests on Safari only
	@polymer test -l safari


# Running -----------------------------------------------------------------------------------

.PHONY: serve
serve:  ## Serve project locally using the Polymer server
	@polymer serve --port ${LOCAL_PORT}


# GitHub Repository -----------------------------------------------------------------------------------

.PHONY: open-url-github-repo
open-url-github-repo:  ## Open URL of project GitHub repository page
	@open https://github.com/filethis/${NAME}

.PHONY: print-url-github-repo
print-url-github-repo:  ## Print URL of project GitHub repository page
	@echo https://github.com/filethis/${NAME}


# Release -----------------------------------------------------------------------------------

.PHONY: print-bower-info
print-bower-info:  ## Print information about published Bower package
	@bower info ${NAME};

.PHONY: find-version-everywhere
find-version-everywhere:  # Internal: Find and print versions of this project in use by all peer projects
	@echo Current: ${VERSION}; \
	find .. -name bower.json -print | xargs grep "filethis/${NAME}#^[0-9]\+.[0-9]\+.[0-9]\+" || echo Not used;

.PHONY: set-version-everywhere
set-version-everywhere:  # Internal: Set version of this project in all peer projects
	@find .. -name bower.json -print | xargs sed -i .bak 's/${NAME}#^[0-9][0-9]*.[0-9][0-9]*.[0-9][0-9]*/${NAME}#^${VERSION}/g' && rm ./bower.json.bak || echo Not used;

.PHONY: tag-release
tag-release:  # Deprecated.
	@git tag -a v${VERSION} -m '${VERSION}';

.PHONY: tag-release-idempotent
tag-release-idempotent:  # Deprecated.
	@if [[ $$(git tag --list v${VERSION}) ]]; then \
		echo Tag v${VERSION} already applied; \
	else \
		git tag -a v${VERSION} -m '${VERSION}'; \
	fi;

.PHONY: git-push-tags
git-push-tags:  # Deprecated.
	git push --tags;

.PHONY: release-github-version
release-github-version:  # Internal target: Tag with current version and push tags to remote for the git project. Usually invoked as part of a release via 'release' target.
	@if [[ $$(git tag --list v${VERSION}) ]]; then \
		echo Tag v${VERSION} already applied; \
	else \
		git tag -a v${VERSION} -m '${VERSION}'; \
	fi; \
	git push --tags;

.PHONY: release-confirm
release-confirm:
	@read -p "Did you remember to bump the version number in this project's Makefile and bower.json files, and then to push all changes? [y/n] " CONT; \
	if [ "$$CONT" = "y" ]; then \
	  echo "Continuing"; \
	else \
		exit 1; \
	fi

.PHONY: release-unsafe
release-unsafe: release-github-version release-github-pages release-bower
	@echo Released version ${VERSION} of \"${NAME}\" project

.PHONY: release
release: release-confirm release-unsafe  ## Release version of project.
	@echo;


# Git -----------------------------------------------------------------------------------


.PHONY: add-git
add-git:  ## Add all git changes, interactively
	git add -A --interactive

.PHONY: add-git-dry-run
add-git-dry-run:  ## Do a "dry run" of adding all changes so they will be printed out
	git add -A -n;

.PHONY: add-git-fast
add-git-fast:  ## Add all git changes non-interactively
	git add -A

.PHONY: commit-git
commit-git:  ## Commit all git changes, prompting for a checkin message
	git commit

.PHONY: commit-git-fast
commit-git-fast:  ## Commit all git changes with a worthless message
	git commit -m "WIP"

.PHONY: push-git
push-git:  ## Push from Git repository
	git push

.PHONY: pull-git
pull-git:  ## Pull from Git repository
	git pull

.PHONY: print-git-status
print-git-status:  ## Print git status
	@git status -s


# Help -----------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help