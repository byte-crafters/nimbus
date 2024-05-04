-- CreateTable
CREATE TABLE "FolderAccess" (
    "id" TEXT NOT NULL,
    "userRights" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FolderAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FolderAccess" ADD CONSTRAINT "FolderAccess_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderAccess" ADD CONSTRAINT "FolderAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
