-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "rootFolderId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "fd_id" TEXT NOT NULL,
    "fd_name" TEXT,
    "fd_path" TEXT[],
    "fd_removed" BOOLEAN NOT NULL DEFAULT false,
    "parentFolderId" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("fd_id")
);

-- CreateTable
CREATE TABLE "File" (
    "fl_id" TEXT NOT NULL,
    "fl_name" TEXT NOT NULL,
    "fl_extension" TEXT NOT NULL,
    "fl_removed" BOOLEAN NOT NULL DEFAULT false,
    "folderId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fl_id")
);

-- CreateTable
CREATE TABLE "FileAccess" (
    "userRights" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FileAccess_pkey" PRIMARY KEY ("fileId","userId")
);

-- CreateTable
CREATE TABLE "FolderAccess" (
    "userRights" INTEGER NOT NULL,
    "folderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FolderAccess_pkey" PRIMARY KEY ("folderId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_rootFolderId_key" ON "User"("rootFolderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("fd_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAccess" ADD CONSTRAINT "FileAccess_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("fl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAccess" ADD CONSTRAINT "FileAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderAccess" ADD CONSTRAINT "FolderAccess_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderAccess" ADD CONSTRAINT "FolderAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
