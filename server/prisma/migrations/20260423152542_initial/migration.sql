-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_login" VARCHAR(60) NOT NULL,
    "user_pass" VARCHAR(255) NOT NULL,
    "user_nicename" VARCHAR(50) NOT NULL,
    "user_email" VARCHAR(100) NOT NULL,
    "user_url" VARCHAR(100) NOT NULL DEFAULT '',
    "user_registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_activation_key" VARCHAR(255) NOT NULL DEFAULT '',
    "user_status" INTEGER NOT NULL DEFAULT 0,
    "display_name" VARCHAR(250) NOT NULL DEFAULT '',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "post_author" INTEGER NOT NULL,
    "post_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_date_gmt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_content" TEXT NOT NULL,
    "post_title" TEXT NOT NULL,
    "post_excerpt" TEXT NOT NULL DEFAULT '',
    "post_status" VARCHAR(20) NOT NULL DEFAULT 'publish',
    "comment_status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "ping_status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "post_password" VARCHAR(255) NOT NULL DEFAULT '',
    "post_name" VARCHAR(200) NOT NULL DEFAULT '',
    "post_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_modified_gmt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_parent" INTEGER NOT NULL DEFAULT 0,
    "guid" VARCHAR(255) NOT NULL DEFAULT '',
    "menu_order" INTEGER NOT NULL DEFAULT 0,
    "post_type" VARCHAR(20) NOT NULL DEFAULT 'post',
    "post_mime_type" VARCHAR(100) NOT NULL DEFAULT '',
    "comment_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "comment_post_ID" INTEGER NOT NULL,
    "comment_author" TEXT NOT NULL,
    "comment_author_email" VARCHAR(100) NOT NULL DEFAULT '',
    "comment_author_url" VARCHAR(200) NOT NULL DEFAULT '',
    "comment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment_date_gmt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment_content" TEXT NOT NULL,
    "comment_karma" INTEGER NOT NULL DEFAULT 0,
    "comment_approved" VARCHAR(20) NOT NULL DEFAULT '1',
    "comment_agent" VARCHAR(255) NOT NULL DEFAULT '',
    "comment_type" VARCHAR(20) NOT NULL DEFAULT '',
    "comment_parent" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postmeta" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "meta_key" VARCHAR(255),
    "meta_value" TEXT,

    CONSTRAINT "postmeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentmeta" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "meta_key" VARCHAR(255),
    "meta_value" TEXT,

    CONSTRAINT "commentmeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL DEFAULT '',
    "slug" VARCHAR(200) NOT NULL DEFAULT '',
    "term_group" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "term_taxonomy" (
    "id" SERIAL NOT NULL,
    "term_id" INTEGER NOT NULL,
    "taxonomy" VARCHAR(32) NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "parent" INTEGER NOT NULL DEFAULT 0,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "term_taxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "term_relationships" (
    "object_id" INTEGER NOT NULL,
    "term_taxonomy_id" INTEGER NOT NULL,
    "term_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "term_relationships_pkey" PRIMARY KEY ("object_id","term_taxonomy_id")
);

-- CreateIndex
CREATE INDEX "posts_post_type_post_status_post_date_idx" ON "posts"("post_type", "post_status", "post_date");

-- CreateIndex
CREATE INDEX "posts_post_author_idx" ON "posts"("post_author");

-- CreateIndex
CREATE INDEX "comments_comment_post_ID_idx" ON "comments"("comment_post_ID");

-- CreateIndex
CREATE INDEX "postmeta_post_id_idx" ON "postmeta"("post_id");

-- CreateIndex
CREATE INDEX "commentmeta_comment_id_idx" ON "commentmeta"("comment_id");

-- CreateIndex
CREATE INDEX "term_taxonomy_taxonomy_idx" ON "term_taxonomy"("taxonomy");

-- CreateIndex
CREATE UNIQUE INDEX "term_taxonomy_term_id_taxonomy_key" ON "term_taxonomy"("term_id", "taxonomy");

-- CreateIndex
CREATE INDEX "term_relationships_term_taxonomy_id_idx" ON "term_relationships"("term_taxonomy_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_author_fkey" FOREIGN KEY ("post_author") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_comment_post_ID_fkey" FOREIGN KEY ("comment_post_ID") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postmeta" ADD CONSTRAINT "postmeta_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentmeta" ADD CONSTRAINT "commentmeta_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "term_taxonomy" ADD CONSTRAINT "term_taxonomy_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "term_relationships" ADD CONSTRAINT "term_relationships_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "term_relationships" ADD CONSTRAINT "term_relationships_term_taxonomy_id_fkey" FOREIGN KEY ("term_taxonomy_id") REFERENCES "term_taxonomy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
