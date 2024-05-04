/*
  Warnings:

  - The primary key for the `FileAccess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FileAccess` table. All the data in the column will be lost.
  - The primary key for the `FolderAccess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FolderAccess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FileAccess" DROP CONSTRAINT "FileAccess_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FileAccess_pkey" PRIMARY KEY ("fileId", "userId");

-- AlterTable
ALTER TABLE "FolderAccess" DROP CONSTRAINT "FolderAccess_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FolderAccess_pkey" PRIMARY KEY ("folderId", "userId");
