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

.PHONY: test
test:  ## Run tests on all browsers
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


# GitHub Repository

.PHONY: open-url-github-repo
open-url-github-repo:  ## Open URL of project GitHub repository page
	@open https://github.com/filethis/${NAME}

.PHONY: print-url-github-repo
print-url-github-repo:  ## Print URL of project GitHub repository page
	@echo https://github.com/filethis/${NAME}


# Release -----------------------------------------------------------------------------------

.PHONY: tag-release
tag-release:  # Internal target: Tag the git project with the current release number. Usually invoked as part of a release via 'release-github-repo' target.
	@git tag -a v${VERSION} -m '${VERSION}'

.PHONY: git-push-tags
git-push-tags:  # Internal target: Push tags to remote for the git project. Usually invoked as part of a release via 'release-github-repo' target.
	@git push --tags;

.PHONY: release-github-repo
release-github-repo: test-chrome tag-release git-push-tags  ## Release new version of project in GitHub repository. Before running, bump value of "VERSION" variable at top of project Makefile.
	@echo Released version ${VERSION} of \"${NAME}\" project code in GitHub repository. See: https://github.com/filethis/${NAME}/releases;


# Help -----------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help