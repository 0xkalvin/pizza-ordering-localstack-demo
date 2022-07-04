.PHONY: default all build down

default: infra all

build:
	@docker compose build --no-cache

all:
	@docker compose up pizza-ordering-server pizza-ordering-worker

infra:
	@docker compose up -d localstack

down:
	@docker compose down --rmi local --remove-orphans
