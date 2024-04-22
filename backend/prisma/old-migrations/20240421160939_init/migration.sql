/*
  Warnings:

  - You are about to drop the column `fd_owner` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rootFolderId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rootFolderId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "fd_owner";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rootFolderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_rootFolderId_key" ON "User"("rootFolderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;
