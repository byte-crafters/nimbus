/*
  Warnings:

  - The primary key for the `Folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dr_id` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `dr_name` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `dr_owner` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `dr_parent_dir_id` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `dr_path` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `dr_removed` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `fd_owner` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fd_parent_folder_id` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_dr_parent_dir_id_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_pkey",
DROP COLUMN "dr_id",
DROP COLUMN "dr_name",
DROP COLUMN "dr_owner",
DROP COLUMN "dr_parent_dir_id",
DROP COLUMN "dr_path",
DROP COLUMN "dr_removed",
ADD COLUMN     "fd_id" SERIAL NOT NULL,
ADD COLUMN     "fd_name" TEXT,
ADD COLUMN     "fd_owner" TEXT NOT NULL,
ADD COLUMN     "fd_parent_folder_id" INTEGER NOT NULL,
ADD COLUMN     "fd_path" INTEGER[],
ADD COLUMN     "fd_removed" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("fd_id");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_fd_parent_folder_id_fkey" FOREIGN KEY ("fd_parent_folder_id") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;
