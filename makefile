default: clean build

clean:
	rm -r -f dist .temp

build:
	cd cmd/weblink && \
	pack bundle \
		--prod \
		--ts-config ./tsconfig.json \
		--out ../../dist

stats:
	make clean
	cd cmd/weblink && \
	pack bundle \
		--prod \
		--ts-config ./tsconfig.json \
		--out ../../dist \
		--stats

sandbox:
	cd testing/sandbox && \
	pack bundle \
		--prod \
		--ts-config ./tsconfig.json \
		--out ../../.temp \
		--watch

dev:
	make clean
	npx concurrently --kill-others \
		"make sandbox" \
		"npx http-server .temp"