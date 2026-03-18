# Khayah — 다음 할 일 & 실행 방법

## 1. 해야 할 일 체크리스트

### 1) 환경 준비
- [ ] **Node.js 18+** 설치 확인: 터미널에서 `node -v`
- [ ] **PostgreSQL** 준비
  - 로컬: PostgreSQL 설치 후 DB 생성
  - 또는 **Render**에서 PostgreSQL 인스턴스 생성 후 연결 정보(URL) 복사

### 2) 의존성 설치
- [ ] 프로젝트 루트에서 한 번만 실행:
  ```bash
  npm install
  ```
- [ ] (선택) 클라이언트에 React 플러그인 등이 없다면:
  ```bash
  cd client
  npm install
  cd ..
  ```

### 3) 환경 변수 설정
- [ ] **server/.env** 파일 만들기:
  ```bash
  # 루트의 예시 파일을 서버 폴더로 복사
  copy .env.example server\.env
  ```
- [ ] **server/.env** 열어서 수정:
  - `DATABASE_URL`: Render(또는 로컬) PostgreSQL 연결 문자열로 변경  
    예: `DATABASE_URL="postgresql://유저:비밀번호@호스트:5432/DB이름?schema=public"`
  - `PORT=3001` (원하면 변경)

### 4) DB 마이그레이션 (테이블 생성)
- [ ] 서버 폴더로 이동 후 마이그레이션 실행:
  ```bash
  cd server
  npx prisma migrate dev --name init
  ```
  - 최초 실행 시 테이블이 생성됨
  - **주의**: `DATABASE_URL`이 올바르지 않으면 실패함

### 5) (선택) 기존 워드프레스 데이터 이관
- [ ] MySQL(워드프레스) → PostgreSQL로 데이터를 옮기려면:
  - 별도 마이그레이션 스크립트 또는 ETL 도구 필요
  - 지금 구조는 **빈 DB에서 새로 사용**하는 것을 전제로 함

---

## 2. 실행 방법

### 개발 모드 (클라이언트 + 서버 동시 실행)

**프로젝트 루트**에서:

```bash
npm run dev
```

- **클라이언트**: http://localhost:5173  
- **서버 API**: http://localhost:3001  
- API 프록시: 클라이언트에서 `/api/*` 요청은 자동으로 3001 포트로 전달됨

### 각각 따로 실행

```bash
# 터미널 1 — 서버만
npm run server

# 터미널 2 — 클라이언트만
npm run client
```

- 서버: http://localhost:3001  
- 클라이언트: http://localhost:5173  

### 프로덕션 빌드

```bash
npm run build
```

- `client/dist` — 프론트 빌드 결과  
- `server/dist` — 서버는 `npm run build` 시 TypeScript 컴파일 (서버에서 `node dist/index.js` 등으로 실행)

---

## 3. 실행 후 확인

1. 브라우저에서 http://localhost:5173 접속  
2. 홈 화면이 뜨고, **포스트 목록**이 비어 있거나(DB에 데이터 없음) 또는 API에서 받은 글이 보이면 정상  
3. API 직접 확인:  
   - http://localhost:3001/health → `{"status":"ok"}`  
   - http://localhost:3001/api/posts?page=1&perPage=10 → `{ "posts": [], "total": 0 }` 또는 글 목록

---

## 4. 자주 쓰는 명령어

| 목적           | 명령어 (실행 위치)        |
|----------------|---------------------------|
| 클라이언트+서버 동시 실행 | `npm run dev` (루트)      |
| 서버만 실행     | `npm run server` (루트)   |
| 클라이언트만 실행 | `npm run client` (루트)   |
| 전체 빌드       | `npm run build` (루트)     |
| Prisma 클라이언트 재생성 | `cd server` 후 `npx prisma generate` |
| DB 마이그레이션 | `cd server` 후 `npx prisma migrate dev --name 마이그레이션이름` |

---

## 5. 문제 발생 시

- **서버가 안 뜨거나 DB 연결 오류**  
  - `server/.env`의 `DATABASE_URL`이 맞는지 확인  
  - Render 사용 시: 외부 접속 허용, SSL 필요하면 URL에 `?sslmode=require` 등 추가

- **클라이언트에서 API 404**  
  - 서버가 3001에서 떠 있는지 확인  
  - `npm run dev`로 같이 띄웠다면 프록시 설정(vite.config.ts)으로 `/api`가 3001로 가야 함

- **포스트가 안 보임**  
  - DB에 `posts` 테이블에 `post_status='publish'`, `post_type='post'`인 행이 있어야 함  
  - 없으면 Prisma Studio로 데이터 추가: `cd server` → `npx prisma studio`
