-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_fd_parent_folder_id_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "fd_parent_folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_fd_parent_folder_id_fkey" FOREIGN KEY ("fd_parent_folder_id") REFERENCES "Folder"("fd_id") ON DELETE SET NULL ON UPDATE CASCADE;
