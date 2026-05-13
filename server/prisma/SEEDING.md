## Seeding content (5 kinds × 5 items)

This project stores content in WordPress-like tables (`posts`, `postmeta`).

The seed script will:

- Delete existing seeded content for these kinds:
  - 공지사항
  - 활동소식
  - 연간소식지
  - 언론보도
  - 스토리
- Insert **5 items per kind**
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

