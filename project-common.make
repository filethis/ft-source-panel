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

.PHONY: bower-install
bower-install:  ## Install all Bower dependencies specified in bower.json file
	@bower install --save


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

.PHONY: bower-info
bower-info:  ## Print information about published Bower package
	@bower info ${NAME};


# Help -----------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help