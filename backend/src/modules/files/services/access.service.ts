import { Inject, Injectable } from '@nestjs/common';
import { TFileId, TFolder, TFolderId } from '../../file-structure/file-structure.type';
import { PostgresConnection } from '../../storage/postgres-connection';
import { TRights } from '../file.type';
import { AccessRepository } from './access.repository';
import { UserGrantAccessUnauthorized } from '../../errors/logic/CannotCreateRootFolder';

export type TFileRights = {
    view?: boolean;
    edit?: boolean;
};

export type TFolderRights = {
    view?: boolean;
    edit?: boolean;
};


export const FILE_NONE = 0;
export const FILE_VIEW = 1;
export const FILE_EDIT = 2;

export const FOLDER_NONE = 0;
export const FOLDER_VIEW = 1;
export const FOLDER_EDIT = 2;



@Injectable()
export class AccessService {
    // private connection: PostgresClient;

    constructor(
        @Inject(AccessRepository) private accessRepository: AccessRepository
    ) { }

    async getAccessForFile(fileId: string, userId: string) {
        const result = await this.accessRepository.getAccessForFile(fileId, userId)
        return result
    }

    async getAccessForFolder(folderId: string, userId: string) {
        const result = await this.accessRepository.getAccessForFolder(folderId, userId);
        return result;
    }

    async getFileShares(fileId: TFileId) {
        const fileShares = await this.accessRepository.getFileShares(fileId);
        return fileShares;
    }

    async getFolderShares(folderId: TFolderId) {
        const folderShares = await this.accessRepository.getFolderShares(folderId);
        return folderShares;
    }

    async setFileAccess(
        rights: TFileRights,
        sharedUserId: string,
        fileId: TFileId,
        ownerUserId: string
    ) {
        const fileOwner = await this.accessRepository.getFileOwner(fileId);
        if (fileOwner.id === ownerUserId) {
            /** User who is granting access is an owner of the file */
            const fileAccessValue = rights.edit ? FILE_EDIT : (rights.view ? FILE_VIEW : FILE_NONE);

            if (fileAccessValue === FILE_NONE) {
                await this.accessRepository.removeFileAccess(sharedUserId, fileId);
                return null;
            }
            return this.accessRepository.setFileAccess(fileAccessValue, sharedUserId, fileId);
        }

        throw new UserGrantAccessUnauthorized();
    }

    async setFolderAccess(
        rights: TFolderRights,
        userId: string,
        folderId: TFolderId,
        ownerUserId: string
    ) {
        const folderOwner = await this.accessRepository.getFolderOwner(folderId);
        if (folderOwner.id === ownerUserId) {
            const folderAccessValue = rights.edit ? FOLDER_EDIT : (rights.view ? FOLDER_VIEW : FOLDER_NONE);

            if (folderAccessValue === FOLDER_NONE) {
                await this.accessRepository.removeFolderAccess(userId, folderId);
                return null;
            }
            return this.accessRepository.setFolderAccess(folderAccessValue, userId, folderId);
        }

        throw new UserGrantAccessUnauthorized();
    }

    async getFilesSharedWithUser(
        userId: string
    ) {
        return await this.accessRepository.getFilesSharedWithUser(userId)
    }
}
