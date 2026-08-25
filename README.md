<div align="center">

# Khayah

**사단법인 카야 인터내셔널** 공식 웹사이트  
WordPress(BeTheme)에서 **React + Express** 스택으로 현대화한 프로젝트입니다.

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

<br />

[![Deploy Guide](https://img.shields.io/badge/Deploy-docs%2FDEPLOY.md-b20838?style=flat-square)](docs/DEPLOY.md)
[![Local Dev](https://img.shields.io/badge/Local_Dev-Setup-555?style=flat-square)](#local-development)

</div>

---

## 목차

- [개요](#개요)
- [아키텍처](#아키텍처)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [로컬 개발](#로컬-개발)
- [배포](#배포)
- [API](#api)
- [워드프레스 마이그레이션 참고](#워드프레스-마이그레이션-참고)

---

## 개요

| 항목 | 내용 |
|------|------|
| **브랜드 컬러** | `#b20838` (Khayah Red) |
| **프론트** | Vite + React 19 SPA |
| **백엔드** | Express 5 REST API |
| **데이터베이스** | PostgreSQL (Supabase) |
| **파일 저장** | Cloudinary (10MB 이하) / Supabase Storage (초과) |
| **배포** | Render Static Site + Render Web Service |

공개 사이트(소식, 스토리, 후원, 소개)와 `/admin` 관리자 영역으로 구성됩니다.

---

## 아키텍처

```mermaid
flowchart LR
  Browser[Browser]

  subgraph Render
    Web[Static Site client]
    API[Web Service server]
  end

  subgraph Data
    DB[(Supabase PostgreSQL)]
    CDN[Cloudinary]
    Storage[Supabase Storage]
  end

  Cron[cron-job.org / GitHub Actions]

  Browser --> Web
  Web -->|VITE_API_BASE| API
  API --> DB
  API --> CDN
  API --> Storage
  Cron -->|GET /health/db| API
```

> Render Free Web Service는 **15분 미사용 시 sleep** 됩니다.  
> `GET /health/db`를 10분마다 핑해 Render와 Supabase를 깨우도록 설정해 두었습니다.

---

## 기술 스택

### Frontend (`client/`)

| 구분 | 기술 |
|------|------|
| Framework | React 19, React Router 7 |
| Language | TypeScript 5.9 |
| Build | Vite 7 |
| PDF 미리보기 | pdfjs-dist |
| Styling | CSS (BeTheme-child 레이아웃 및 브랜드 반영) |

### Backend (`server/`)

| 구분 | 기술 |
|------|------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| ORM | Prisma 7, `@prisma/adapter-pg` |
| Database | PostgreSQL (Supabase Session pooler) |
| Upload | Multer, Cloudinary SDK, Supabase Storage |
| Dev | ts-node-dev, tsx |

### Infrastructure

| 구분 | 서비스 |
|------|--------|
| DB 호스팅 | [Supabase](https://supabase.com) |
| API 및 프론트 호스팅 | [Render](https://render.com) |
| 이미지 및 PDF CDN | [Cloudinary](https://cloudinary.com) |
| Keep-alive | GitHub Actions (`.github/workflows/keepalive.yml`) 또는 [cron-job.org](https://cron-job.org) |

---

## 주요 기능

### 공개 사이트

- 홈 (배너, 스토리, 공지, 나눔의 결실)
- 소식: 공지사항, 활동소식, 연간소식지, 언론보도, 재정보고
- 카야 소개, 후원 안내, 고객 문의 등 정적 및 동적 페이지
- 게시글 상세, 브레드크럼, 목록 페이지네이션
- 연간소식지: 연도 및 호수 필터, PDF 브라우저 인라인 보기

### 관리자 (`/admin`)

- 게시글 CRUD (종류별 메타: 연간소식지 연도 및 호수, 언론보도, 스토리 등)
- 리치텍스트 에디터 (글자색 포함)
- 이미지 및 PDF 업로드 (크기에 따라 Cloudinary / Supabase 자동 분기)
- 재정보고, 메인 배너 관리 (일부 UI 목업)

> 관리자 로그인은 현재 **목업 세션**입니다. OAuth 연동 예정.

---

## 프로젝트 구조

```
khayah/
├── client/                 # Vite + React 프론트엔드
│   ├── src/
│   │   ├── components/     # 공통 UI (Header, PostDetail, Pagination ...)
│   │   ├── features/       # 홈 섹션, admin
│   │   ├── pages/          # 아카이브, 정적 페이지
│   │   ├── services/       # API 클라이언트
│   │   └── styles/         # 페이지별 CSS
│   └── public/images/      # 정적 에셋
├── server/                 # Express API
│   ├── prisma/             # 스키마, 마이그레이션, seed
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── utils/
├── docs/
│   └── DEPLOY.md           # Supabase + Render 배포 상세 가이드
└── .github/workflows/
    └── keepalive.yml       # Render/Supabase keep-alive cron
```

---

## 로컬 개발

<a id="local-development"></a>

### 사전 요구사항

- **Node.js 18+**
- **Supabase** PostgreSQL (Session pooler URI)

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

**`server/.env`** — `server/.env.example` 참고

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@...pooler.supabase.com:5432/postgres?sslmode=require"
MOCK_DATA=false
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=khayah
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=uploads
```

**`client/.env`**

```env
VITE_API_BASE=http://localhost:3001/api
```

### 3. DB 마이그레이션

```bash
cd server
npx prisma migrate deploy
npm run prisma:seed   # 선택: 샘플 데이터
```

### 4. 실행

```bash
# 루트 — 프론트 + API 동시 실행
npm run dev
```

| URL | 설명 |
|-----|------|
| http://localhost:5173 | 프론트 |
| http://localhost:3001/health | API 헬스체크 |
| http://localhost:3001/health/db | DB ping (keep-alive용) |
| http://localhost:5173/admin | 관리자 (목업 로그인) |

### 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | client + server 동시 dev |
| `npm run client` | 프론트만 |
| `npm run server` | API만 |
| `npm run build` | client + server 프로덕션 빌드 |
| `cd server && npm run prisma:seed` | DB 시드 |

---

## 배포

**Supabase + Render + Cloudinary** 구성의 단계별 가이드:

**[docs/DEPLOY.md](./docs/DEPLOY.md)**

요약:

1. Supabase에 DB 생성 후 `prisma migrate deploy`
2. Render Web Service (`server/`) — API
3. Render Static Site (`client/`) — `VITE_API_BASE` 설정
4. API `CLIENT_ORIGIN`에 프론트 URL 등록 (CORS)
5. GitHub Secret `KEEP_ALIVE_URL` = `https://your-api.onrender.com/health/db`

---

## API

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/health` | 서버 상태 |
| `GET` | `/health/db` | DB ping (keep-alive) |
| `GET` | `/api/posts` | 게시글 목록 (`kind`, `page`, `perPage`) |
| `GET` | `/api/posts/:slug` | 게시글 상세 |
| `GET` | `/api/pages` | 정적 페이지 목록 |
| `GET` | `/api/youtube/latest` | YouTube 최신 영상 |
| `POST` | `/api/uploads/image` | 이미지 업로드 |
| `POST` | `/api/uploads/document` | PDF 업로드 |
| `GET` | `/api/uploads/pdf` | PDF 인라인 프록시 (한글 파일명) |
| `*` | `/api/admin/posts` | 관리자 게시글 CRUD |
| `*` | `/api/financial-reports` | 재정보고 |

---

## 워드프레스 마이그레이션 참고

클라이언트는 WordPress **BeTheme-child**의 레이아웃, 문구, 색상을 반영했습니다.

- **이미지**: `wp-content/uploads/` → `client/public/images/` (경로는 `client/public/images/README.md` 참고)
- **콘텐츠**: WordPress 포스트 및 페이지를 PostgreSQL로 이관하면 공개 목록에 표시됩니다
- 레포 내 `20170227_khayah_*_archive/` 는 **원본 WP 백업** 참고용입니다 (배포 대상 아님)

---

<div align="center">

<br />

**사단법인 카야 인터내셔널** · 개발 NGO

<br />

</div>
