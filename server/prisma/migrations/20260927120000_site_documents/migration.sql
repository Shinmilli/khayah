-- 관리자 설정 문서. 이미 런타임에 만들어졌어도 배포 마이그레이션이 실패하지 않게 한다.
CREATE TABLE IF NOT EXISTS "site_documents" (
    "key" VARCHAR(64) NOT NULL,
    "body" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_documents_pkey" PRIMARY KEY ("key")
);
