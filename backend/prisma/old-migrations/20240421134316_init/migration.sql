-- CreateTable
CREATE TABLE "Folder" (
    "dr_id" TEXT NOT NULL,
    "dr_name" TEXT,
    "dr_owner" TEXT NOT NULL,
    "dr_path" TEXT[],
    "dr_removed" BOOLEAN NOT NULL DEFAULT false,
    "dr_parent_dir_id" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("dr_id")
);

-- CreateTable
CREATE TABLE "File" (
    "fl_id" TEXT NOT NULL,
    "fl_name" TEXT NOT NULL,
    "fl_extension" TEXT NOT NULL,
    "fl_owner" TEXT NOT NULL,
    "fl_removed" BOOLEAN NOT NULL DEFAULT false,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fl_id")
);

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_dr_parent_dir_id_fkey" FOREIGN KEY ("dr_parent_dir_id") REFERENCES "Folder"("dr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("dr_id") ON DELETE RESTRICT ON UPDATE CASCADE;
