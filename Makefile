.PHONY: compile release test

UGLIFYJS=node_modules/.bin/uglifyjs
HANDROLL=node_modules/.bin/handroll

OUT=selectize.js
OUT_MIN=selectize.min.js
BANNER=/*! selectize.js | https://github.com/brianreavis/selectize.js | Apache License (v2) */

all: compile
test:
	npm test
compile:
	$(HANDROLL) src/index.js --format web --dest dist/js/selectize.js
	$(HANDROLL) src/index.js --format es --dest dist/js/selectize.mjs
	cp dist/js/selectize.js ./selectize.js
	$(UGLIFYJS) --mangle -b beautify=false,ascii-only=true --output $(OUT_MIN) $(OUT)
	@echo "$(BANNER)" | cat - $(OUT_MIN) > temp && mv temp $(OUT_MIN)
	@echo "`cat $(OUT_MIN) | gzip -9f | wc -c` bytes (gzipped)"
release:
ifeq ($(strip $(version)),)
	@echo "\033[31mERROR:\033[0;39m No version provided."
	@echo "\033[1;30mmake release version=1.0.0\033[0;39m"
else
	sed -i.bak 's/"version": "[^"]*"/"version": "$(version)"/' selectize.jquery.json
	sed -i.bak 's/"version": "[^"]*"/"version": "$(version)"/' package.json
	rm *.bak
	make compile
	npm test || exit 1
	git add .
	git commit -a -m "Released $(version)."
	git tag v$(version)
	git push origin master
	git push origin --tags
	npm publish
	git checkout gh-pages
	mv -f ../.selectize.js js/selectize.js
	git commit -a -m "Updated selectize.js to latest version."
	git push origin gh-pages
	git checkout master
	@echo "\033[32mv${version} released\033[0;39m"
endif
