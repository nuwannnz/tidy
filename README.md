# Tidy

## Setting up project

TODO

## CI/CD

TODO

## Branching strategy

```sh
main        → Production-ready
develop     → Integration / staging branch
feature/AB-12*   → Feature/topic branches off develop
hotfix/BC-32*    → Urgent fixes off main, then merged back to main & develop
release/*   → Optional release prep branches off develop
```

Rules:

- PRs must target develop (except hotfixes).
- feature, fix or hotfix branch names must include a ticket number. ex: `feature/PI-1-weekly-view`
- Merge to main only after testing/QA on develop.
- Use semantic, scoped commits as described below.

## Commit Format (Conventional Commits + Scope)

```sh
<type>(<scope>[,<scope>]): <message>
```

### Types (what kind of change)

- feat → a new feature
- fix → a bug fix
- docs → documentation only changes
- style → changes that don’t affect meaning (formatting, linting)
- refactor → code change that neither fixes a bug nor adds a feature
- perf → performance improvement
- test → adding/updating tests
- build → build system or dependencies changes
- ci → CI/CD changes
- chore → maintenance, housekeeping

### Scope (where in monorepo)

- web → Next.js app (apps/web)
- api → Node.js/Go backend (apps/api)
- iac → Terraform infra (apps/iac)
- pwa → PWA-related code (service worker, manifest)
- libs/\* → shared libraries (e.g. libs/ui, libs/utils, libs/pwa-utils)

### Examples

```sh
feat(web): add weekly task board UI
fix(api,web): correct task sorting by date
feat(iac): add S3 + CloudFront for web deployment
refactor(libs/pwa-utils): simplify sync engine
docs(web): update PWA install instructions
chore: bump dependencies
ci: add GitHub Actions workflow for test
```
