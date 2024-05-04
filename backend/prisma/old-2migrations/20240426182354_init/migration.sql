/*
  Warnings:

  - Changed the type of `userRights` on the `FileAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userRights` on the `FolderAccess` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FileAccess" DROP COLUMN "userRights",
ADD COLUMN     "userRights" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FolderAccess" DROP COLUMN "userRights",
ADD COLUMN     "userRights" INTEGER NOT NULL;
