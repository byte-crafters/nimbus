-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_fd_parent_folder_id_fkey";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_fd_parent_folder_id_fkey" FOREIGN KEY ("fd_parent_folder_id") REFERENCES "Folder"("fd_id") ON DELETE SET NULL ON UPDATE CASCADE;
