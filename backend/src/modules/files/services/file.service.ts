import { Inject, Injectable } from '@nestjs/common';
import path from 'node:path';
import { IConfigService } from '../../config/dev.config.service';
import {
    DataRepository,
    // IFileStructureRepository,
    // TFileRepository,
} from '../../file-structure/data.repository';
import { IFileSystemService } from '../../file-system/file-system.service';
import { IDataRepository, TFileId, TFileRepository, TFolderId } from '../../file-structure/file-structure.type';
import { AccessService } from './access.service';

export interface IFileService { }

export type TRemoveFileResult = {
    folderId: TFolderId;
    fileId: TFileId;
};

export type TGetFileResult = {
    // folderId: string;
    // fileId: string;
};

@Injectable()
export class FileService implements IFileService {
    constructor(
        @Inject(Symbol.for('IFileStructureRepository')) private dataRepo: IDataRepository,
        @Inject(Symbol.for('IFileSystemService')) private fs: IFileSystemService,
        @Inject(Symbol.for('IConfigService')) private config: IConfigService,
        @Inject(AccessService) private accessService: AccessService,

    ) { }

    async getStorageInfo(myId: string) {
        const extensions = await this.dataRepo.getExtensionsInfo(myId);
        const size = await this.dataRepo.getStorageInfo(myId);

        return { extensions, size };
    }

    /** Files */
    async getSharedWithMeFiles(myId: string) {
        const files = await this.dataRepo.getSharedWithMeFiles(myId);
        return files;
    }

    async getMySharedFiles(myId: string) {
        const files = await this.dataRepo.getAllMySharedFiles(myId);
        return files;
    }

    async getAllFilesOfUser(userId: string) {
        const files = await this.dataRepo.getAllFilesOfUser(userId);
        return files;
    }





    /** Folders */
    async getSharedWithMeFolders(myId: string) {
        const files = await this.dataRepo.getSharedWithMeFolders(myId);
        return files;
    }

    async getMySharedFolders(myId: string) {
        const files = await this.dataRepo.getAllMySharedFolders(myId);
        return files;
    }

    async getAllFoldersOfUser(userId: string) {
        const files = await this.dataRepo.getAllFoldersOfUser(userId);
        return files;
    }

    /**
     * TODO: move this method to FileSystemService
     */
    private getRealPath(userFolder: string) {
        return path.join(this.config.getStoragePath(), userFolder);
    }

    async saveFileToFolder(
        userId: string,
        fileBuffer: Buffer,
        folderId: TFolderId,
        fileName: string,
        fileExtension: string,
        size: number
    ): Promise<TFileRepository> {
        const createdFile = await this.dataRepo.createFile(fileName, fileExtension, folderId, userId, size);
        const realFolderPath = this.getRealPath(folderId);
        const realFilePath = path.join(realFolderPath, createdFile.id.toString());
        this.fs.writeFile(fileBuffer, realFilePath);

        return createdFile;
    }

    // async createFolder() {

    // }

    async getFileStreamById(fileId: TFileId, userId: string): Promise<any> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const file = await this.dataRepo.getFileById(fileId);
            const realFolderPath = this.getRealPath(userId);
            const realFilePath = path.join(realFolderPath, file.id.toString());

            const fileStream = this.fs.getFileStream(realFilePath);
            return fileStream;
        } catch (e: unknown) { }
    }

    async getFileInfoById(fileId: TFileId, userId: string): Promise<TFileRepository> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const file = await this.dataRepo.getFileById(fileId);
            return file;
        } catch (e: unknown) { }
    }

    async removeFile(fileId: TFileId, requesterId: string, softDelete: boolean): Promise<TRemoveFileResult> {
        try {
            const access = await this.accessService.getAccessForFile(fileId, requesterId);
            const folder = await this.dataRepo.getFileById(fileId);

            if (access === null && folder.ownerId !== requesterId) {
                throw new Error('You have no access to delete this file.');
            } else {
                /**
                 * TODO
                 * Run this code only as a transaction
                 */

                const { folderId, id } = await this.dataRepo.removeFile(fileId, softDelete);
                if (!softDelete) {
                    const realFolderPath = this.getRealPath(requesterId);
                    const realFilePath = path.join(realFolderPath, id.toString());
                    await this.fs.removeFile(realFilePath);

                }

                // const res: {
                //     folderId: string,
                //     id: string;
                // } = await this.dataRepo.removeFile(fileId, softDelete);

                // const currentFolder = await this.dataRepo.getFolderById(folderId);
                // const children = await this.dataRepo.getChildrenFolders(folderId);
                // const folderFiles = await this.dataRepo.getChildrenFiles(folderId);

                return {
                    folderId,
                    fileId: id,
                };
            }
        } catch (e: unknown) {
            throw e;
        }
    }

    async getRemovedFiles(requesterId: string) {
        try {
            // const access = await this.accessService.getAccessForFile(fileId, requesterId);
            // const folder = await this.dataRepo.getFileById(fileId);
            const removedfs = await this.dataRepo.getRemovedFiles(requesterId);
            return removedfs;
        } catch (e: unknown) {
            throw e;
        }
    }

    async getRemovedFolders(requesterId: string) {
        try {
            // const access = await this.accessService.getAccessForFile(fileId, requesterId);
            // const folder = await this.dataRepo.getFileById(fileId);
            const removedfs = await this.dataRepo.getRemovedFolders(requesterId);
            return removedfs;
        } catch (e: unknown) {
            throw e;
        }
    }

    async removeFolder(folderId: string, requesterId: string, softDelete: boolean) {
        try {

            const access = await this.accessService.getAccessForFolder(folderId, requesterId);
            const folder = await this.dataRepo.getFolderById(folderId) as any;

            if (access === null && folder.ownerId !== requesterId) {
                throw new Error('You have no access to delete this folder.');
            } else {
                console.log('s');

                const resdel = await this.dataRepo.removeFolder(folderId, softDelete);
                if (!softDelete) {
                    /** TODO: remove nested subfolders */
                    const folderpath = this.getRealPath(folderId);
                    const res = await this.fs.removeFolder(folderpath);
                }




                /**
                 * TODO
                 * Run this code only as a transaction
                */


                return resdel;
                // // let deletedFolder: TFolder;
                // if (!softDelete) {
                //     /** TODO fix!!! */
                //     /** We should delete all nested subfolders */
                //     deletedFolder = await this.fileSystem.removeFolder(folderId.toString()) as any;
                // } else {
                //     /** We should change this flag for all files in nodes subtree */
                //     deletedFolder = await this.fileStructureRepository.changeFolderRemovedState(folderId, true) as any;
                //     // const deletedFolderFS = await this.fileSystem.removeFolder(folderId)
                // }
            }


        } catch (e: unknown) {

        }
    }

    async recoverFile(fileId: string, requesterId: string) {
        try {
            return await this.dataRepo.recoverFile(fileId, requesterId);
        } catch (e: unknown) {
            throw e;
        }
    }

    async recoverFolder(folderId: string, requesterId: string) {
        try {
            return await this.dataRepo.recoverFolder(folderId, requesterId);
        } catch (e: unknown) {
            throw e;
        }
    }
}
