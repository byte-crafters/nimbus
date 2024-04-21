/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Folder` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_fd_parent_folder_id_fkey";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
ALTER COLUMN "fl_id" DROP DEFAULT,
ALTER COLUMN "fl_id" SET DATA TYPE TEXT,
ALTER COLUMN "folderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("fl_id");
DROP SEQUENCE "File_fl_id_seq";

-- AlterTable
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_pkey",
ALTER COLUMN "fd_id" DROP DEFAULT,
ALTER COLUMN "fd_id" SET DATA TYPE TEXT,
ALTER COLUMN "fd_parent_folder_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("fd_id");
DROP SEQUENCE "Folder_fd_id_seq";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_fd_parent_folder_id_fkey" FOREIGN KEY ("fd_parent_folder_id") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;
