# FEATURE PROMPT — Setup Repo & CI/CD

**Phase:** 1 (Foundation) · **Effort:** 1-2 ngày · **Persona:** Tech Lead + Backend
**Pre-read:** Master Context §3 (Kiến trúc 5 tầng), Phase 1 §"Gateway Service Design", ADR-003 (stack), ADR-005 (observability)

---

## Mục tiêu

Khởi tạo monorepo (hoặc 2 repo riêng nếu team prefer) cho Gateway service và Portal UI, kèm CI/CD pipeline, dev environment Docker, baseline tooling.

## Acceptance Criteria

- [ ] Repo structure tuân Conventional, có README với getting started <10 phút
- [ ] CI pipeline chạy: lint → typecheck → unit test → build → security scan
- [ ] CD pipeline deploy auto staging on merge `main`, manual production
- [ ] Docker Compose dev environment up trong <2 phút (`docker compose up`)
- [ ] Pre-commit hook: lint + format + commit lint
- [ ] Coverage report tự động post lên PR
- [ ] Secret management: dotenv + vault integration documented

## File Structure đề xuất (monorepo)

```
haravan-invoice/
├── apps/
│   ├── gateway/              # Backend service
│   │   ├── src/
│   │   │   ├── adapters/     # TVANAdapter implementations
│   │   │   ├── api/          # REST controllers
│   │   │   ├── core/         # Domain logic
│   │   │   ├── infra/        # DB, Redis, Kafka clients
│   │   │   ├── workers/      # Background jobs
│   │   │   └── index.ts
│   │   ├── test/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── portal/               # Frontend (React)
│       ├── src/
│       ├── test/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   ├── shared-types/         # Canonical Invoice model
│   ├── shared-utils/
│   └── design-tokens/        # Hara DS tokens nếu npm
├── infra/
│   ├── docker-compose.yml    # Local dev: postgres, redis, kafka, mailhog
│   ├── k8s/                  # Production manifests / Helm
│   └── terraform/            # Cloud infra
├── docs/
│   ├── adr/                  # ADR markdown files
│   ├── runbook/
│   └── api/                  # OpenAPI spec
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd-staging.yml
│       └── cd-production.yml
├── .changeset/               # Versioning
├── package.json              # Root with workspaces
├── pnpm-workspace.yaml       # hoặc yarn workspaces
├── turbo.json                # Turborepo config
└── README.md
```

## Prompt cho AI

```
Bạn là Senior DevOps Engineer. Tạo monorepo Haravan Invoice với cấu
trúc trên (file structure rõ ở phần trên). Stack: Node 20 LTS, pnpm
workspaces, Turborepo, TypeScript strict, ESLint, Prettier, Vitest.

Yêu cầu cụ thể:

1. Root package.json với scripts: dev, build, test, lint, typecheck.
   Dùng turbo để parallelize.

2. apps/gateway: Fastify framework (lý do: fast, schema validation
   built-in, plugin ecosystem). Cấu trúc adapters/api/core/infra/workers
   theo hexagonal architecture.

3. apps/portal: Vite + React 18 + TypeScript + TanStack Query +
   TanStack Router. Style: Tailwind hoặc emotion (chọn 1, justify).

4. packages/shared-types: định nghĩa CanonicalInvoice, TVANAdapter
   interface (xem prompt 03 và Phase 1 plan §Develop để chi tiết).

5. infra/docker-compose.yml: Postgres 16, Redis 7, Kafka (KRaft mode
   không cần Zookeeper), Mailhog cho dev email.

6. .github/workflows/ci.yml:
   - On push/PR: pnpm install → lint → typecheck → test với coverage
     → build → docker build (no push)
   - Cache pnpm + turbo cho speed
   - Post coverage comment lên PR
   - Run trivy scan trên Docker image

7. .github/workflows/cd-*.yml:
   - cd-staging: trigger on push main, deploy auto
   - cd-production: manual approval, semantic versioning với changeset

8. Pre-commit hook (husky + lint-staged): format staged files,
   commitlint conventional commits.

9. README.md có:
   - Project overview 5 dòng
   - Prerequisites (node, pnpm, docker)
   - Getting started: clone → cp .env.example .env → pnpm install →
     docker compose up → pnpm dev (target <10 phút)
   - Folder structure
   - Common commands

10. CONTRIBUTING.md với code review checklist + branch naming
    (feat/AAA-123-short-desc, fix/AAA-456-...).

Output từng file content. Ưu tiên correctness hơn brevity. Mark
những chỗ bạn không chắc bằng `// TODO: verify`. Đừng bịa Hilo
URL/credentials — dùng placeholder ENV var.
```

## Verification Checklist

- [ ] `pnpm install` thành công không error
- [ ] `docker compose up` postgres + redis + kafka khởi động <2 phút
- [ ] `pnpm dev` chạy gateway port 3000 và portal port 5173
- [ ] `pnpm test` pass với 0 file (chỉ skeleton)
- [ ] `pnpm lint` 0 error
- [ ] PR trên branch test trigger CI thành công
- [ ] Trivy scan không có CRITICAL vulnerability
- [ ] README test trên fresh machine: clone → up → 10 phút
