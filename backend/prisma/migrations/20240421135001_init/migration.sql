/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `fl_id` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `dr_id` column on the `Folder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `folderId` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dr_parent_dir_id` on the `Folder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_dr_parent_dir_id_fkey";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "fl_id",
ADD COLUMN     "fl_id" SERIAL NOT NULL,
DROP COLUMN "folderId",
ADD COLUMN     "folderId" INTEGER NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("fl_id");

-- AlterTable
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_pkey",
DROP COLUMN "dr_id",
ADD COLUMN     "dr_id" SERIAL NOT NULL,
DROP COLUMN "dr_parent_dir_id",
ADD COLUMN     "dr_parent_dir_id" INTEGER NOT NULL,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("dr_id");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_dr_parent_dir_id_fkey" FOREIGN KEY ("dr_parent_dir_id") REFERENCES "Folder"("dr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("dr_id") ON DELETE RESTRICT ON UPDATE CASCADE;
