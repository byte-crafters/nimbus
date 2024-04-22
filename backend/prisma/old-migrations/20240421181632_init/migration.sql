/*
  Warnings:

  - You are about to drop the `file_access_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file_access_list" DROP CONSTRAINT "file_access_list_fileId_fkey";

-- DropForeignKey
ALTER TABLE "file_access_list" DROP CONSTRAINT "file_access_list_userId_fkey";

-- DropTable
DROP TABLE "file_access_list";

-- CreateTable
CREATE TABLE "FileAccess" (
    "id" TEXT NOT NULL,
    "userRights" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FileAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileAccess" ADD CONSTRAINT "FileAccess_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("fl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAccess" ADD CONSTRAINT "FileAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
