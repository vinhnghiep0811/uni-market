/*
  Warnings:

  - You are about to drop the column `zaloLink` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "zaloLink";
