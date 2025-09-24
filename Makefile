.PHONY: build test run

IMAGE_NAME=desafio-eurotec

build:
	docker build -t $(IMAGE_NAME) .

test:
	docker run --rm $(IMAGE_NAME) npm test

run:
	docker run -p 3000:3000 $(IMAGE_NAME)
