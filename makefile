default: clean build

clean:
	rm -r -f dist .temp

build:
	cd cmd/weblink && \
	pack bundle \
		--prod \
		--ts-config ./tsconfig.json \
		--out ../../dist/weblink

stats:
	make clean
	cd cmd/weblink && \
	pack bundle \
		--prod \
		--ts-config ./tsconfig.json \
		--out ../../dist/weblink \
		--stats

sandbox:
	cd testing/sandbox && \
	pack bundle \
		--ts-config ./tsconfig.json \
		--out ../../.temp \
		--watch

extension:
	rm -r -f ./dist/extension
	mkdir -p ./dist/extension
	cp -r ./cmd/extension/static/* ./dist/extension
	npx concurrently \
		"cd cmd/extension/content && pack bundle --out ../../../dist/extension/content --prod" \
		"cd cmd/extension/devtools && pack bundle --out ../../../dist/extension/devtools --prod" \
		"cd cmd/extension/panel && pack bundle --out ../../../dist/extension/panel --prod"

dev-extension:
	rm -r -f ./dist/extension
	mkdir -p ./dist
	cp -r ./cmd/extension/static ./dist/extension
	npx concurrently \
		"cd cmd/extension/content && pack bundle --out ../../../dist/extension/content --prod --watch" \
		"cd cmd/extension/devtools && pack bundle --out ../../../dist/extension/devtools --prod --watch" \
		"cd cmd/extension/panel && pack bundle --out ../../../dist/extension/panel --prod --watch"

dev:
	rm -r -f .temp
	npx concurrently --kill-others \
		"make sandbox" \
		"npx http-server .temp"