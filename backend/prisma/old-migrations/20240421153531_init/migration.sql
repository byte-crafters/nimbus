-- CreateTable
CREATE TABLE "file_access_list" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRights" TEXT NOT NULL,

    CONSTRAINT "file_access_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_access_list" ADD CONSTRAINT "file_access_list_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("fl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_access_list" ADD CONSTRAINT "file_access_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
