import { Prisma } from "@prsm/generated/prisma-postgres-client-js";

export type CreateUserRootFolderStructure = {
    parentFolderId: TFolderId;
    name: string;
    id: TFolderId;
};

export type TFolderId = string;

export type TFileId = string;

export type TFolder = {
    id: TFolderId;
    name: string;
    // parentFolder: string;
    parentFolder: Omit<TFolder, "parentFolder">;
    owner: any;
    path: TFolderId[];
};
export type TFileStructureRemoveAllData = Prisma.BatchPayload;

export type TFolderRepository = Prisma.Result<Prisma.FolderDelegate, Prisma.FolderFindUniqueArgs, 'findUnique'>;
export type TFileRepository = Prisma.Result<Prisma.FileDelegate, Prisma.FileFindUniqueArgs, 'findUnique'>;

export interface IDataRepository {
    getClosestSharedFolder(folderId: string, userId: string, access?: number): Promise<any>;
    /**
     * For testing purpose only!
     * TODO: remove from production code.
     */
    removeAllData(): Promise<TFileStructureRemoveAllData[]>;
    createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure>;
    createFolder(userId: string, folderName: string, parentFolderId: TFolderId): Promise<TFolderRepository>;
    getChildrenFiles(folderId: TFolderId): Promise<TFileRepository[]>;
    getChildrenFolders(folderId: TFolderId): Promise<TFolderRepository[]>;
    createFile(name: string, extension: string, folderId: TFolderId, userId: string): Promise<TFileRepository>;

    getRemovedFiles(userId: string): Promise<any>;
    getRemovedFolders(userId: string): Promise<any>;
    removeFile(fileId: TFileId, softDelete: boolean): Promise<Pick<TFileRepository, 'folderId' | 'id'>>;
    removeFolder(folderId: TFileId, softDelete: boolean): Promise<any>;

    recoverFile(fileId: TFileId, userId: string): Promise<any>;
    recoverFolder(folderId: TFileId, userId: string): Promise<any>;

    
    getUserRootFolder(userId: string): Promise<TFolderRepository>;
    getFolderById(folderId: TFolderId): Promise<TFolder | null>;
    renameFolder(newFolderName: string, folderId: TFolderId): Promise<TFolderRepository>;
    deleteFolder(folderId: TFolderId): Promise<TFolderRepository>;
    getFolderPath(folderId: TFolderId): Promise<Pick<TFolder, "id" | "name">[]>;
    changeFolderRemovedState(folderId: TFolderId, removedState: boolean): Promise<TFolderRepository>;
    getFileById(fileId: TFileId): Promise<TFileRepository>;

    getAllFilesOfUser(userId: string): Promise<any>;
    getAllFoldersOfUser(userId: string): Promise<any>;
    getAllMySharedFiles(myId: string): Promise<any>;
    getAllMySharedFolders(myId: string): Promise<any>;
    getSharedWithMeFiles(myId: string): Promise<any>;

    getSharedWithMeFolders(myId: string): Promise<any>;
}