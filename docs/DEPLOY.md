# Khayah 배포 가이드 — Supabase(DB) + Render(서버·프론트) + Cloudinary(파일)

새 계정 기준. 구성:

```
브라우저
  ├─ 프론트 (Render Static Site)  →  API 호출
  └─ API (Render Web Service)     →  Supabase Postgres
                                  →  Cloudinary (이미지·PDF)
```

Cloudflare는 쓰지 않습니다.

---

## 0. 준비물

| 계정 | 용도 |
|------|------|
| [Supabase](https://supabase.com) | PostgreSQL |
| [Render](https://render.com) | Express API + 정적 프론트 |
| [Cloudinary](https://cloudinary.com) | 이미지·PDF |
| GitHub | 코드 저장소 |

로컬: Node 18+, `postgresql-client`(선택, dump용)

---

## 1. Supabase — DB 만들기

1. New project  
   - Region: **Northeast Asia (Seoul)**  
   - DB 비밀번호 **저장**
2. 상단 **Connect** → **Session pooler** (포트 **5432**) URI 복사  

예:

```text
postgresql://postgres.PROJECT_REF:비밀번호@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
```

> WSL/로컬·Render 모두 **Session pooler** 권장.  
> Direct(`db.xxx.supabase.co`)는 IPv6만 되는 환경에서 연결 실패할 수 있음.

### 스키마 적용 (로컬 한 번)

```bash
cd server
# server/.env 에 DATABASE_URL = 위 pooler URI
npx prisma migrate deploy
# (선택) 샘플 데이터
npm run prisma:seed
```

Supabase → **Table Editor**에 `posts`, `users` 등이 보이면 OK.

---

## 2. Cloudinary — 파일 저장

1. Cloudinary 가입 → Dashboard  
2. **Cloud name / API Key / API Secret** 복사  
3. 나중에 Render Environment에 넣음  

업로드 API: `POST /api/uploads/document` (PDF), `POST /api/uploads/image`  
→ 응답 `url`이 `https://res.cloudinary.com/...` 형태.

무료(약 25 credits/월)는 NGO·소규모 사이트에 보통 충분합니다.

---

## 3. GitHub에 코드 push

```bash
git add -A
git commit -m "chore: Supabase DB + Render + Cloudinary"
git push -u origin feature/supabase   # 또는 main
```

---

## 4. Render — API 서버 (Web Service)

1. Render → **New → Web Service**  
2. GitHub 레포 연결  
3. 설정:

| 항목 | 값 |
|------|-----|
| Name | `khayah-api` |
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance | Free (또는 Starter) |

4. **Environment**:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:비밀번호@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
MOCK_DATA=false
CLIENT_ORIGIN=https://아직-프론트없으면-나중에-수정
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=khayah
```

5. Deploy 후:

```bash
curl https://khayah-api-xxxx.onrender.com/health
# {"status":"ok"}
```

> Free Web Service는 **15분 미사용 시 sleep** → 첫 요청이 느릴 수 있음.

---

## 5. Render — 프론트 (Static Site)

1. Render → **New → Static Site**  
2. 같은 GitHub 레포  
3. 설정:

| 항목 | 값 |
|------|-----|
| Name | `khayah-web` |
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. **Environment**:

```env
VITE_API_BASE=https://khayah-api-xxxx.onrender.com/api
```

> `VITE_` 변수는 **빌드 시점**에 들어갑니다. API URL 바꾸면 **프론트 재배포** 필요.

5. Deploy 후 나온 URL을 복사.

6. **API 서비스로 돌아가서** Environment 수정:

```env
CLIENT_ORIGIN=https://khayah-web-xxxx.onrender.com
```

→ API 재배포 (CORS).

---

## 6. 로컬 개발

**`server/.env`**

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:비밀번호@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require"
MOCK_DATA=false
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=khayah
```

**`client/.env`**

```env
VITE_API_BASE=http://localhost:3001/api
```

```bash
# 루트에서
npm run dev
```

- 사이트: http://localhost:5173  
- API: http://localhost:3001/health  
- 관리자: http://localhost:5173/admin (목업 로그인)

---

## 7. 확인 체크리스트

```
[ ] Supabase Table Editor에 posts 있음
[ ] /health → ok
[ ] /health/db → {"status":"ok","db":"ok"}
[ ] /api/posts 목록 JSON
[ ] 관리자에서 이미지/PDF 업로드 → cloudinary.com URL
[ ] 공개 페이지에서 공지·뉴스 표시
[ ] CORS: 프론트에서 API 호출 에러 없음
[ ] GitHub Actions Keepalive (아래 9번)
```

---

## 8. (선택) 옛 Render Postgres 삭제

Supabase로만 쓸 때 → 예전 Render PostgreSQL 인스턴스 **Delete** (비용 절감).  
Web Service / Static Site는 유지.

---

## 9. Cron — sleep / pause 방지

| 서비스 | 문제 | cron으로 |
|--------|------|----------|
| Render Free Web | ~15분 미사용 → sleep (첫 요청 느림) | **10분마다** `/health/db` 호출 |
| Supabase Free | ~7일 무활동 → pause | 같은 ping이 DB도 깨움 |

코드에 이미 있음:

- 엔드포인트: `GET /health/db` → `SELECT 1` (Render 깨우기 + Supabase ping)
- 워크플로: `.github/workflows/keepalive.yml` (10분마다)

### 설정 (API 배포 후)

1. GitHub 레포 → **Settings → Secrets and variables → Actions**
2. **New repository secret**
   - Name: `KEEP_ALIVE_URL`
   - Value: `https://내-api.onrender.com/health/db`
3. **Actions → Keepalive → Run workflow** 로 한 번 수동 실행해 보기
4. 이후 10분마다 자동 실행

> Private 레포는 GitHub Actions 무료 분이 제한될 수 있습니다.  
> 대안: [cron-job.org](https://cron-job.org) 에서 같은 URL을 10분마다 GET (가입만 하면 됨).

---

## 환경 변수 요약

| 어디에 | 변수 | 설명 |
|--------|------|------|
| Render API | `DATABASE_URL` | Supabase Session pooler |
| Render API | `CLIENT_ORIGIN` | 프론트 URL (CORS) |
| Render API | `CLOUDINARY_*` | 파일 업로드 |
| Render Static | `VITE_API_BASE` | `https://api.../api` |
| 로컬 client | `VITE_API_BASE` | `http://localhost:3001/api` |
| GitHub Actions | `KEEP_ALIVE_URL` (secret) | `https://api.../health/db` |

**프론트에 Supabase URL/anon key는 필요 없습니다.** DB는 서버만 연결합니다.
