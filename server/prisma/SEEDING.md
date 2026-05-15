## Seeding content

WordPress-like tables (`posts`, `postmeta`).

The seed script will:

- Delete existing seeded content for these kinds:
  - 공지사항
  - 활동소식
  - 연간소식지
  - 언론보도
  - 스토리
- Insert **5 items** each for: 공지사항, 활동소식, 언론보도 (스토리는 10건)
- **연간소식지**는 연도(`khayah_newsletter_year`)·호수(`khayah_newsletter_issue`)별로 **7건** 고정 시드
  - 예: 2024년 83·84호, 2025년 85·86·87호, 2026년 1·2호 — `/소식/연간소식지`에서 연도·호수 필터 조합마다 다른 카드만 보이도록 구성
- Attach metadata in `postmeta` using keys like:
  - `khayah_kind`
  - `khayah_story_scope`
  - `khayah_press_publisher`, `khayah_press_url`, `khayah_press_date`
  - `khayah_newsletter_mode`, `khayah_pdf_url`, `khayah_cover_url`, `khayah_newsletter_year`, `khayah_newsletter_issue`

### Run

1) Ensure `DATABASE_URL` is set to a reachable Postgres URL (Render external/internal URL), e.g.

`postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`

2) Run:

```bash
npm run prisma:generate
npm run prisma:seed
```

