## Seeding content

WordPress-like tables (`posts`, `postmeta`).

시드 실행 시 아래 유형의 기존 글을 **전부 삭제**한 뒤, 카야 실제 사업(교육·보건·네팔·키르기즈스탄·미얀마·국내)에 맞춘 샘플을 다시 넣습니다.

- 공지사항 (8)
- 활동소식 (10)
- 연간소식지 (7 — 연도·호수 필터용)
- 언론보도 (6)
- 스토리 (12 — 국내/해외/옹호/진행 각 3)
- 진행사업 (8 — 네팔/키르기즈스탄/미얀마/국내 각 2)

메타 키:

- `khayah_kind`
- `khayah_story_scope`
- `khayah_project_region`
- `khayah_press_publisher`, `khayah_press_url`, `khayah_press_date`
- `khayah_newsletter_mode`, `khayah_pdf_url`, `khayah_cover_url`, `khayah_newsletter_year`, `khayah_newsletter_issue`

### Run

1) `DATABASE_URL`이 설정된 `server/.env`를 확인합니다.

2) `server` 디렉터리에서:

```bash
npm run prisma:seed
```
