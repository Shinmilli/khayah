-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "name" VARCHAR(120) NOT NULL DEFAULT '',
    "role" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
