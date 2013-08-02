
build: components index.js color-picker.css
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

coverage:
	@jscoverage index.js cov.js
	@mv index.js bak.js
	@mv cov.js index.js
	@$(MAKE) build
	@mocha-browser test/index.html -R html-cov > coverage.html
	@mv bak.js index.js

travis:
	@node_modules/.bin/component install --dev
	@node_modules/.bin/component build --dev
	@node_modules/.bin/mocha-browser test/index.html

spm:
	@rm -fr src
	@mkdir src
	@python .transport.py > src/color-picker.js
	@cp color-picker.css src/
	@spm build

.PHONY: clean coverage
