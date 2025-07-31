
BACKEND=apps/backend

generate:
	cd $(BACKEND) && pnpm db:generate

migrate-dev:
	cd $(BACKEND) && pnpm db:migrate:dev

migrate-prod:
	cd $(BACKEND) && pnpm db:migrate:prod

push-dev:
	cd $(BACKEND) && pnpm db:push:dev

push-prod:
	cd $(BACKEND) && pnpm db:push:prod

migrate: generate migrate-dev

create-feature:
	cd $(BACKEND) && pnpm gen:feature $(domain) $(feature)

.PHONY: generate migrate-dev migrate-prod push-dev push-prod migrate