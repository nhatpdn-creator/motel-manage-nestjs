-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" SERIAL NOT NULL,
    "admin_uuid" VARCHAR(64) NOT NULL,
    "admin_login_id" VARCHAR(64) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "code_id" TEXT,
    "code_expired" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
