# Khayah — 다음 할 일

배포·환경 설정은 **[docs/DEPLOY.md](docs/DEPLOY.md)** 를 보세요.  
(Supabase DB + Render API/프론트 + Cloudinary)

## 로컬 실행

```bash
# server/.env, client/.env 설정 후
npm install
npm run dev
```

- 클라이언트: http://localhost:5173  
- API: http://localhost:3001  
- 관리자: http://localhost:5173/admin  

## 구성 요약

| 역할 | 서비스 |
|------|--------|
| DB | Supabase Postgres |
| API | Render Web Service (`server/`) |
| 프론트 | Render Static Site (`client/`) |
| 파일 | Cloudinary |
